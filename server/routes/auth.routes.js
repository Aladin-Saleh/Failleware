const router = require('express').Router();
const authController = require('../controllers/user.controller');


// Routes de connexion
router.post('/sign-in',authController.signIn);


// Route de déconnexion
router.get('/sign-out',authController.signOut);


// Route d'inscription
router.post('/sign-up', authController.signUp);


module.exports = router;