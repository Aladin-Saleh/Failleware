const router = require('express').Router();
const riotController = require('../controllers/riot.controller');


// Récupération des informations d'un summoner par son nom
// GET /api/riot/summoner/:summonerName?region=euw1 (region is optional)
router.get('/summoner/:summonerName', riotController.getSummoner);



module.exports = router;