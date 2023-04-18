// Controller for Riot API (server/controllers/riot.controller.js)
const axios = require('axios');
const ngsi  = require('ngsi-parser')
const LolApi = require('twisted').LolApi;
const api = new LolApi(
    {
        key: process.env.RIOT_API_KEY,
    }
);


function removeIrregularCharacters(str) {
    const regex = /[^a-zA-Z0-9_-]/g; // Expression régulière qui correspond aux caractères non autorisés
    return str.replace(regex, ''); // Supprime tous les caractères non autorisés
}

module.exports.getSummoner = async (req, res) => 
{
    const summonerName  = req.params.summonerName;
    const region        = req.query.region || 'EUW1'; // Par défaut, on prend l'EUW1
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

        const apiSummoner = await api.Summoner.getByName(summonerName, region.toUpperCase());


        // Parcourir les données pour les mettre au format NGSI
        const summoner          = apiSummoner.response;
        const ngsiObjectJSON    = 
        {
            "actionType": "APPEND",
            "entities": []
        } 

        const entities      = {};

        entities["id"]      = removeIrregularCharacters(summoner.name.trim().replace(/ /g, "_"))
        console.log("entities['id']", removeIrregularCharacters(summoner.name.trim().replace(/ /g, "_")));
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
            // console.log("error", error.response);
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
        const apiMasteries = await api.Champion.masteryBySummoner(encryptedSummonerId, region);      

        // Parcourir les données pour les mettre au format NGSI
        const masteries          = apiMasteries.response;
        const ngsiObjectJSON    = 
        {
            "actionType": "APPEND",
            "entities": []
        }

        const entities      = {};
        entities["id"]      = encryptedSummonerId;
        entities["type"]    = "Masteries";

        for (let i=0;i<masteries.length;i++)
        {    
            stats={};
            
            for (const key in masteries[i])
            {
                if (key !== "summonerId" && key !== "championId")
                {
                    stats[key] = ngsi.parseValue(masteries[i][key]);
                }                    
            }

            championId = masteries[i].championId.toString();
            entities[championId] = 
            {
                "type":"Object",
                "value":stats
            };
        }

        ngsiObjectJSON.entities.push(entities);

        const fiwareMasteries = await axios({
            method: 'POST',
            url: `${process.env.FIWARE_URL}/v2/op/update`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: ngsiObjectJSON
        })
        .catch(error => {
            console.log("error", error);
            message = "Une erreur est survenue lors de la mise à jour des informations des masteries dans le contexte FIWARE"
            code    = 400;            
        })

        res.status(200).json({
            message:    'Récupération des informations des masteries',
            masteries:   apiMasteries.response,
            data:       ngsiObjectJSON
        });
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

module.exports.getCurrentGame = async (req, res) => 
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

    try
    {
        const apiCurrentGame = await api.Spectator.activeGame(encryptedSummonerId, region);      
        
        res.status(200).json(
            {
              data: apiCurrentGame
            }
        )
    }
    catch (error)
    {
        res.status(code).json(
            {
                message:    message || 'Une erreur est survenue lors de la récupération des informations de la partie courrante',
                error:      error
            }
        )
    }
}
  
module.exports.getSummoner = async (req, res) => 
{
    const summonerName  = req.params.summonerName;
    const region        = req.query.region || 'EUW1'; // Par défaut, on prend l'EUW1
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


        const apiSummoner = await api.Summoner.getByName(summonerName, region.toUpperCase());


        // Parcourir les données pour les mettre au format NGSI
        const summoner          = apiSummoner.response;
        const ngsiObjectJSON    = 
        {
            "actionType": "APPEND",
            "entities": []
        } 

        const entities      = {};

        entities["id"]      = removeIrregularCharacters(summoner.name.trim().replace(/ /g, "_"))
        console.log("entities['id']", removeIrregularCharacters(summoner.name.trim().replace(/ /g, "_")));
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
            // console.log("error", error.response);
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
    const region    = req.query.region || 'EUW1'; // Par défaut, on prend l'EUW1

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
        const apiLeagues = await api.League.entries(queue, division, rank,region.toUpperCase(), page)
        // .then(response => console.log("response", response))
        .catch(error => {
            console.log("error", error);
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

            if (removeIrregularCharacters(league.summonerName.trim().replace(/ /g, "_")).length <= 0) continue;
            
            entities["id"]      = removeIrregularCharacters(league.summonerName.trim().replace(/ /g, "_"));
            console.log("entities['id']", removeIrregularCharacters(league.summonerName.trim().replace(/ /g, "_")));
            entities["type"]    = "RankedSummoner"; 

            for (const key in league)
            {
                // console.log("key", key);
                // console.log("league[key]", league[key]);
                entities[key] = ngsi.parseValue(league[key]);
            }
            ngsiObjectJSON.entities.push(entities);

        }

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
            console.log("error", error);
            message = "Une erreur est survenue lors de la mise à jour des informations du summoner dans le contexte FIWARE"
            code    = 400;
        })


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
                reason: message,
                error: error
            }
        )
    }
}

module.exports.getRank = async (req, res) =>
{
    const summonerId   = req.params.summonerId;
    const region       = req.query.region || 'EUW1'; // Par défaut, on prend l'EUW1

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
        const apiRank = await api.League.bySummoner(summonerId, region.toUpperCase())
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

module.exports.getChallengers = async (req, res) =>
{
    const queue     = req.params.queue;
    const region    = req.query.region || 'EUW1'; // Par défaut, on prend l'EUW1

    const message   = '';
    const code      = 500;

    if (!queue)
    {
        res.status(400).json(
            {
                message: 'Le paramètre queue est obligatoire'
            }
        );
    }


    try 
    {
        const apiChallengers = await api.League.getChallengerLeaguesByQueue(queue, region.toUpperCase())
        .catch(error => {
            console.log("error", error);
            message = error.body.status.message || "Une erreur est survenue lors de la récupération des informations des challengers"
            code    = error.body.status.status_code || 400;
        });

        // Parcourir les données pour les mettre au format NGSI
        const challengers           = apiChallengers.response['entries'];
        console.log("challengers", challengers);

        const ngsiObjectJSON = 
        {
            "actionType": "APPEND",
            "entities": []
        };

        for (const challenger of challengers)
        {
            const entities      = {};
            entities["id"]      =  removeIrregularCharacters(challenger['summonerName']).trim().replace(/ /g, "_");

            if (removeIrregularCharacters(challenger['summonerName']).trim().replace(/ /g, "_").length <= 0) continue;

            console.log("entities['id']", removeIrregularCharacters(challenger['summonerName']).trim().replace(/ /g, "_"));
            entities["type"]    = "RankedChallengerSummoner";

            for (const key in challenger)
            {
                console.log("key", key, "challenger[key]", challenger[key]);
                entities[key] = ngsi.parseValue(challenger[key]);                
            }
            ngsiObjectJSON.entities.push(entities);
            console.log("entities", ngsiObjectJSON);
        }

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
        })

        res.status(200).json({
            message:    'Récupération des informations des challengers',
            challengers: apiChallengers.response
        });
        
    } 
    catch (error) 
    {
        res.status(code).json({
            message: 'Une erreur est survenue lors de la récupération des informations des challengers',
            error: error
        });

    }


}

module.exports.getGrandMasters = async (req, res) =>
{
    const queue     = req.params.queue;
    const region    = req.query.region || 'EUW1'; // Par défaut, on prend l'EUW1

    const message   = '';
    const code      = 500;

    if (!queue)
    {
        res.status(400).json(
            {
                message: 'Le paramètre queue est obligatoire'
            }
        );
    }


    try 
    {
        const apiGrandMasters = await api.League.getGrandMasterLeagueByQueue(queue, region.toUpperCase())
        .catch(error => {
            console.log("error", error);
            message = error.body.status.message || "Une erreur est survenue lors de la récupération des informations des grand Masters"
            code    = error.body.status.status_code || 400;
        });

        // Parcourir les données pour les mettre au format NGSI
        const grandMasters           = apiGrandMasters.response['entries'];
        console.log("grandMasters", grandMasters);

        const ngsiObjectJSON = 
        {
            "actionType": "APPEND",
            "entities": []
        };

        for (const grandMaster of grandMasters)
        {
            const entities      = {};
            entities["id"]      =  removeIrregularCharacters(grandMaster['summonerName']).trim().replace(/ /g, "_");
            if (removeIrregularCharacters(grandMaster['summonerName']).trim().replace(/ /g, "_").length <= 0) continue;
            console.log("entities['id']", removeIrregularCharacters(grandMaster['summonerName']).trim().replace(/ /g, "_"));
            entities["type"]    = "RankedGrandMasterSummoner";

            for (const key in grandMaster)
            {
                console.log("key", key, "grandMaster[key]", grandMaster[key]);
                entities[key] = ngsi.parseValue(grandMaster[key]);                
            }
            ngsiObjectJSON.entities.push(entities);
            console.log("entities", ngsiObjectJSON);
        }

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
        })

        res.status(200).json({
            message:    'Récupération des informations des challengers',
            challengers: apiGrandMasters.response
        });
        
    } 
    catch (error) 
    {
        res.status(code).json({
            message: 'Une erreur est survenue lors de la récupération des informations des challengers',
            error: error
        });

    }

}

module.exports.getMasters = async (req, res) =>
{
    const queue     = req.params.queue;
    const region    = req.query.region || 'EUW1'; // Par défaut, on prend l'EUW1

    const message   = '';
    const code      = 500;

    if (!queue)
    {
        res.status(400).json(
            {
                message: 'Le paramètre queue est obligatoire'
            }
        );
    }

    try
    {
        const apiMaster = await api.League.getMasterLeagueByQueue(queue, region.toUpperCase())
        .catch(error => {
            console.log("error", error);
            message = error.body.status.message || "Une erreur est survenue lors de la récupération des informations des master"
            code    = error.body.status.status_code || 400;
        });

        // Parcourir les données pour les mettre au format NGSI
        const masters           = apiMaster.response['entries'];
        // console.log("masters", masters);

        const ngsiObjectJSON = 
        {
            "actionType": "APPEND",
            "entities": []
        };



        if (masters.length > 10)
        {
            // On va devoir faire plusieurs requêtes
            const nbRequest = Math.ceil(masters.length / 10);
            console.log("nbRequest", nbRequest);
            for (let i = 0; i < nbRequest; i++)
            {
                const mastersPart = masters.slice(i * 10, (i + 1) * 10);
                console.log("mastersPart", mastersPart);

                for (const master of mastersPart)
                {
                    const entities      = {};
                    entities["id"]      =  removeIrregularCharacters(master['summonerName']).trim().replace(/ /g, "_");
                    if (removeIrregularCharacters(master['summonerName']).trim().replace(/ /g, "_").length <= 0) continue;
                    console.log("entities['id']", removeIrregularCharacters(master['summonerName']).trim().replace(/ /g, "_"));
                    entities["type"]    = "RankedMasterSummoner";
        
                    for (const key in master)
                    {
                        // console.log("key", key, "master[key]", master[key]);
                        entities[key] = ngsi.parseValue(master[key]);                
                    }
                    ngsiObjectJSON.entities.push(entities);
                    // console.log("entities", ngsiObjectJSON);
                }
    
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
                })

            }
        }
        else
        {
            for (const master of masters)
            {
                const entities      = {};
                entities["id"]      =  removeIrregularCharacters(master['summonerName']).trim().replace(/ /g, "_");
                if (removeIrregularCharacters(master['summonerName']).trim().replace(/ /g, "_").length <= 0) continue;
                console.log("entities['id']", removeIrregularCharacters(master['summonerName']).trim().replace(/ /g, "_"));
                entities["type"]    = "RankedMasterSummoner";
    
                for (const key in master)
                {
                    // console.log("key", key, "master[key]", master[key]);
                    entities[key] = ngsi.parseValue(master[key]);                
                }
                ngsiObjectJSON.entities.push(entities);
                // console.log("entities", ngsiObjectJSON);
            }

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
            })
        }
        
        


        // console.log("ngsiObjectJSON", ngsiObjectJSON);



        res.status(200).json({
            message:    'Récupération des informations des challengers',
            challengers: apiMaster.response
        });

    }
    catch (error)
    {
        res.status(code).json({
            message: 'Une erreur est survenue lors de la récupération des informations des challengers',
            error: error
        });
    }





}

module.exports.getMatchList = async (req, res) =>
{
    const puuid    = req.params.puuid;
    const region    = req.query.region || 'europe'; // Par défaut, on prend l'EUW1

    const message   = '';
    const code      = 500;

    if (!puuid)
    {
        res.status(400).json(
            {
                message: 'Le paramètre puuid est obligatoire'
            }
        );
    }


    try 
    {
        const apiMatchList = await api.MatchV5.list(puuid, region)
        .catch(error => {
            console.log("error", error);
            message = error.body.status.message || "Une erreur est survenue lors de la récupération des informations des matchs"
            code    = error.body.status.status_code || 400;
        });


        // Parcourir les données pour les mettre au format NGSI
        const matchs           = apiMatchList.response
        console.log("matchs", matchs);
        const ngsiObjectJSON =
        {
            "actionType": "APPEND",
            "entities": []
        }

        const entities = {};

        entities["id"]      = puuid
        entities["type"]    = "MatchHistory";
        entities["matchs"]  = ngsi.parseValue(matchs);

        ngsiObjectJSON.entities.push(entities);
        console.log("ngsiObjectJSON", ngsiObjectJSON);

        const fiwareMatchList = await axios({
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
        })
        


        res.status(200).json({
            message:    'Récupération des informations des matchs',
            matchs: apiMatchList.response
        });

    } 
    catch (error)
    {   
        res.status(code).json({
            message: 'Une erreur est survenue lors de la récupération des informations des matchs',
            error: error
        });
    }









}

module.exports.getMatch = async (req, res) =>
{
    const matchId    = req.params.matchId;
    const region    = req.query.region || 'europe'; // Par défaut, on prend l'EUW1

    const message   = '';
    const code      = 500;

    if (!matchId)
    {
        res.status(400).json(
            {
                message: 'Le paramètre matchId est obligatoire'
            }
        );
    }


    try
    {
        const apiMatch = await api.MatchV5.get(matchId, region)
        .catch(error => {
            console.log("error", error);
            message = error.body.status.message || "Une erreur est survenue lors de la récupération des informations des matchs"
            code    = error.body.status.status_code || 400;
        });

        res.status(200).json({
            message:    'Récupération des informations des matchs',
            match: apiMatch.response
        });

    }
    catch (error)
    {
        res.status(code).json({
            message: 'Une erreur est survenue lors de la récupération des informations des matchs',
            error: error
        });
    }


}