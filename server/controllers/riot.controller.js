// Controller for Riot API (server/controllers/riot.controller.js)
const axios = require('axios');
const ngsi  = require('ngsi-parser')


module.exports.getSummoner = async (req, res) => 
{
    const summonerName  = req.params.summonerName;
    const region        = req.query.region || 'euw1'; // Par défaut, on prend l'EUW1
    var message         = '';
    var code            = 500;

    if (!summonerName)
    {
        res.status(400).json(
            {
                message: 'Le nom du summoner est obligatoire'
            }
        );
    }

    const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`;

    try
    {
        const apiSummoner = await axios
        ({
            method:     'GET',
            url:        url,
            headers: 
            {
                'X-Riot-Token': process.env.RIOT_API_KEY
            }
        })
        .catch(error => {
            console.log("error", error.response);
            message = error.response.data.status.message;
            code    = error.response.data.status.status_code;
        })

        // Parcourir les données pour les mettre au format NGSI
        const summoner          = apiSummoner.data;
        const ngsiObjectJSON    = 
        {
            "actionType": "APPEND",
            "entities": []
        } 

        const entities      = {};

        entities["id"]      = summoner.name;
        entities["type"]    = "Summoner"; 
        for (const key in summoner)
        {
            if (key !== "id")
            {
                entities[key] = ngsi.parseValue(summoner[key]);
            } 
            else
            {
                entities["accountId"] = ngsi.parseValue(summoner[key]); 
            }
                
        }

        ngsiObjectJSON.entities.push(entities);
        // console.log("ngsiObjectJSON", ngsiObjectJSON);

        const fiwareSummoner = await axios({
            method: 'POST',
            url: `${process.env.FIWARE_URL}/v2/op/update`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: ngsiObjectJSON
        })
        .catch(error => {
            console.log("error", error.response);
            message = "Une erreur est survenue lors de la mise à jour des informations du summoner dans le contexte FIWARE"
            code    = 400;            
        })

        res.status(200).json({
            message:    'Récupération des informations du summoner',
            summoner:   apiSummoner.data,
            data:       ngsiObjectJSON
        });
    }
    catch (error)
    {
        res.status(code).json(
            {
                message:    message || 'Une erreur est survenue lors de la récupération des informations du summoner',
                error:      error
            }
        )
    }

}