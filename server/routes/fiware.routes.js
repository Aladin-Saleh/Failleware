const router = require('express').Router();
const fiwareController = require('../controllers/fiware.controller');

router.get('/:type', fiwareController.getAllFromType);

//entities/:id?type=:type
router.get('/entities/:id', fiwareController.getEntityById);

router.get('/entities/:id/attrs', fiwareController.getAttributesByEntityId);

router.get('/summoner/:summonerName', fiwareController.getSummoner);

module.exports = router;