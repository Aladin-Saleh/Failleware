const router = require('express').Router();
const riotController = require('../controllers/riot.controller');

// Récupération des informations d'un summoner par son nom
// GET /api/riot/summoner/:summonerName?region=euw1 (region is optional)
router.get('/summoner/:summonerName', riotController.getSummoner);

// Récupération des informations des masteries d'unn summoner par son id
// GET /api/riot/masteries/:encryptedSummonerId?region=euw1 (region is optional)
router.get('/masteries/:encryptedSummonerId', riotController.getMasteries);

// Récupération des informations de la partie courante du joueur si il est en game
// GET /api/riot/spectator/:encryptedSummonerId?region=euw1 (region is optional)
router.get('/spectator/:encryptedSummonerId', riotController.getCurrentGame);

module.exports = router;