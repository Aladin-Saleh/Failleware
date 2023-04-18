const router = require('express').Router();
const riotController = require('../controllers/riot.controller');


// Récupération des informations d'un summoner par son nom
// GET /api/riot/summoner/:summonerName?region=euw1 (region is optional)
router.get('/summoner/:summonerName', riotController.getSummoner);

// Récupération des informations des leagues par rank, queue division et page
router.get('/leagues/:rank/:queue/:division/:page', riotController.getLeagues);

// Récupération du rank d'un summoner par son summonerId
router.get('/rank/:summonerId', riotController.getRank);

// Récupération des challengers par queue
router.get('/challengers/:queue', riotController.getChallengers);

// Récupération des masters par queue
router.get('/masters/:queue', riotController.getMasters);

// Récupération des grands maîtres par queue
router.get('/grandmasters/:queue', riotController.getGrandMasters);

// Récupération des matchs d'un summoner par son puuid
router.get('/matchlist/:puuid', riotController.getMatchList);

// Récupération des informations d'un match par son matchId
router.get('/match/:matchId', riotController.getMatch);

module.exports = router;