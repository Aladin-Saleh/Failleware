const userModel = require('../models/user.model');



const maxAge = 3600000 * 24 * 7;

module.exports.signUp = async (req, res) => {
    const { login, riotAccount, password } = req.body;
  
    try {
      const user = await userModel.create({ login, riotAccount, password });
      console.log(user);
      res.status(201).json({
        message: "Utilisateur créé",
        user: user._id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        errors: error
      });
    }
};


module.exports.signIn = async (req, res) => {
    const { login, password } = req.body;
  
    try {
      const user = await userModel.login(login, password);
      res.cookie("Connected", "true", { httpOnly: true, maxAge: maxAge });
      res.status(200).json({
        message: "Connexion réussie",
        user: user._id,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
};


module.exports.signOut = async (req, res) => {
    // Suppression du cookie
    // res.cookie('jwt', '', { maxAge: 1 });
    res.clearCookie("Connected");
    res.status(200).json({
        message: 'Déconnexion réussie',
    });
    // res.redirect("/");
  };



