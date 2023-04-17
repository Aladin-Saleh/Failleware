// Controller for Riot API (server/controllers/riot.controller.js)
const axios = require('axios');
const ngsi  = require('ngsi-parser')
const LolApi = require('twisted').LolApi;
const api = new LolApi(
    {
        key: process.env.RIOT_API_KEY,
    }
);


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


        const apiSummoner = await api.Summoner.getByName(summonerName, region);
        
        


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


module.exports.getMasteries = async (req, res) => 
{
    const encryptedSummonerId  = req.params.encryptedSummonerId;
    const region        = req.query.region || 'euw1'; // Par défaut, on prend l'EUW1
    var message         = '';
    var code            = 500;

    if (!encryptedSummonerId)
    {
        res.status(400).json(
            {
                message: 'Le nom du summoner est obligatoire'
            }
        );
    }

    const url = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${encodeURIComponent(encryptedSummonerId)}`;

    try
    {


        const apiMasteries = await api.Summoner.masteryBySummoner(encryptedSummonerId, region);      


        // Parcourir les données pour les mettre au format NGSI
        const masteries          = apiMasteries.data;
        const ngsiObjectJSON    = 
        {
            "actionType": "APPEND",
            "entities": []
        } 

        const entities      = {};

        entities["id"]      = encryptedSummonerId;
        entities["type"]    = "Masteries"; 
        for (let i = 0; i<masteries.length; i++)
        {
            for (const key in masteries[i])
            {
                if (key !== "summonerId")
                {
                    entities[key] = ngsi.parseValue(masteries[key]);
                }                    
            }
                
        }

        ngsiObjectJSON.entities.push(entities);
        console.log("ngsiObjectJSON", ngsiObjectJSON);

        // const fiwareSummoner = await axios({
        //     method: 'POST',
        //     url: `${process.env.FIWARE_URL}/v2/op/update`,
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     data: ngsiObjectJSON
        // })
        // .catch(error => {
        //     console.log("error", error.response);
        //     message = "Une erreur est survenue lors de la mise à jour des informations des masteries dans le contexte FIWARE"
        //     code    = 400;            
        // })

        // res.status(200).json({
        //     message:    'Récupération des informations des masteries',
        //     summoner:   apiSummoner.data,
        //     data:       ngsiObjectJSON
        // });
    }
    catch (error)
    {
        res.status(code).json(
            {
                message:    message || 'Une erreur est survenue lors de la récupération des informations des masteries',
                error:      error
            }
        )
    }

}