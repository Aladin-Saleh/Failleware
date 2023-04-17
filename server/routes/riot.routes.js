const router = require('express').Router();
const riotController = require('../controllers/riot.controller');


// Récupération des informations d'un summoner par son nom
// GET /api/riot/summoner/:summonerName?region=euw1 (region is optional)
router.get('/summoner/:summonerName', riotController.getSummoner);

// Récupération des informations des leagues par rank, queue division et page
router.get('/leagues/:rank/:queue/:division/:page', riotController.getLeagues);

// Récupération du rank d'un summoner par son summonerId
router.get('/rank/:summonerId', riotController.getRank);


module.exports = router;