// Controller for Riot API (server/controllers/riot.controller.js)
const axios = require('axios');


module.exports.getSummoner = async (req, res) => 
{
    const summonerName = req.params.summonerName;
    const region = req.query.region || 'euw1'; // Par défaut, on prend l'EUW1

    if (!summonerName)
    {
        res.status(400).json(
            {
                message: 'Le nom du summoner est obligatoire'
            }
        );
    }

    const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;

    try
    {
        const response = await axios({
            method: 'GET',
            url: url,
            headers: {
                'X-Riot-Token': process.env.RIOT_API_KEY
            }
        })

        
        
        res.status(200).json({
            message: 'Récupération des informations du summoner',
            summoner: response.data
        });


    }
    catch (error)
    {
        res.status(500).json(
            {
                message: 'Erreur lors de la récupération des informations du summoner',
                error: error
            }
        )
    }

}