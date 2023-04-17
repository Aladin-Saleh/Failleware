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

    try
    {


        const apiSummoner = await api.Summoner.getByName(summonerName, region);
        



        // Parcourir les données pour les mettre au format NGSI
        const summoner          = apiSummoner.response;
        const ngsiObjectJSON    = 
        {
            "actionType": "APPEND",
            "entities": []
        } 

        const entities      = {};

        entities["id"]      = summoner.name.trim().replace(/ /g, "_");
        entities["type"]    = "Summoner"; 
        for (const key in summoner)
        {
            if (key !== "id")
            {
                entities[key] = ngsi.parseValue(summoner[key]);
            } 
            else
            {
                entities["summonerId"] = ngsi.parseValue(summoner[key]); 
            }
                
        }

        ngsiObjectJSON.entities.push(entities);
        console.log("ngsiObjectJSON", ngsiObjectJSON);

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


module.exports.getLeagues = async (req, res) =>
{
    const rank      = req.params.rank;
    const queue     = req.params.queue;
    const division  = req.params.division;
    const page      = req.params.page || 1;  
    const region    = req.query.region || 'euw1'; // Par défaut, on prend l'EUW1

    const message   = '';
    const code      = 500;

    if (!rank || !queue || !division || !page)
    {
        res.status(400).json(
            {
                message: 'Les paramètres rank, queue, division et page sont obligatoires',
                missing: {
                    rank:       !rank,
                    queue:      !queue,
                    division:   !division,
                    page:       !page
                }
            }
        );
    }

    try
    {
        const apiLeagues = await api.League.entries(queue, division, rank, region, page)
        .catch(error => {
            console.log("error", error.body.status);
            message = error.body.status.message || "Une erreur est survenue lors de la récupération des informations des leagues"
            code    = error.body.status.status_code || 400;
        });
        // console.log("apiLeagues", apiLeagues);


        // Parcourir les données pour les mettre au format NGSI
        const leagues           = apiLeagues.response;
        const ngsiObjectJSON    = 
        {
            "actionType": "APPEND",
            "entities": []
        } 

        for (const league of leagues)
        {
            const entities      = {};

            entities["id"]      = league.summonerName.trim().replace(/ /g, "_");
            entities["type"]    = "RankedSummoner"; 

            for (const key in league)
            {
                // console.log("key", key);
                // console.log("league[key]", league[key]);
                entities[key] = ngsi.parseValue(league[key]);
            }
            ngsiObjectJSON.entities.push(entities);

        }

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
        //     console.log("error", error);
        //     message = "Une erreur est survenue lors de la mise à jour des informations du summoner dans le contexte FIWARE"
        //     code    = 400;
        // })


        res.status(200).json({
            message:    'Récupération des informations des leagues',
            leagues:    apiLeagues.response
        })


    }
    catch (error)
    {
        res.status(code).json(
            {
                message: 'Une erreur est survenue lors de la récupération des informations des leagues',
                error: error
            }
        )
    }
}


module.exports.getRank = async (req, res) =>
{
    const summonerId   = req.params.summonerId;
    const region       = req.query.region || 'euw1'; // Par défaut, on prend l'EUW1

    const message      = '';
    const code         = 500;

    if (!summonerId)
    {
        res.status(400).json(
            {
                message: 'Le paramètre summonerId est obligatoire'
            }
        );
    }


    try
    {
        const apiRank = await api.League.bySummoner(summonerId, region)
        .catch(error => {
            console.log("error", error.body.status);
            message = error.body.status.message || "Une erreur est survenue lors de la récupération des informations des leagues"
            code    = error.body.status.status_code || 400;
        });

        // Parcourir les données pour les mettre au format NGSI
        const rank           = apiRank.response;
        console.log("rank", rank);
        const ngsiObjectJSON =
        {
            "actionType": "APPEND",
            "entities": []
        };

        const entities      = {};

        entities["id"]      = rank[0]['summonerName'].trim().replace(/ /g, "_");
        entities["type"]    = "RankedSummoner";

        for (const key in rank[0])
        {
            console.log("key", key, "rank[key]", rank[0][key]);
            entities[key] = ngsi.parseValue(rank[0][key]);
        }
        ngsiObjectJSON.entities.push(entities);
        console.log("ngsiObjectJSON", ngsiObjectJSON);

        const fiwareSummoner = await axios({
            method: 'POST',
            url: `${process.env.FIWARE_URL}/v2/op/update`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: ngsiObjectJSON
        })
        .catch(error => {
            console.log("error", error);
            message = "Une erreur est survenue lors de la mise à jour des informations du summoner dans le contexte FIWARE"
            code    = 400;
        });


        res.status(200).json({
            message:    'Récupération des informations des leagues',
            rank:       apiRank.response
        });
    }
    catch (error)
    {
        res.status(code).json(
            {
                message: 'Une erreur est survenue lors de la récupération des informations des leagues',
                error: error
            }
        )
    }

}