const dotenv            = require('dotenv').config({ path: './config/.env' });

const express           = require('express');
const app               = express();

const cors              = require('cors');

const bodyParser        = require('body-parser');
const riotRoutes        = require('./routes/riot.routes');
const fiwareRoutes      = require('./routes/fiware.routes');
const userRoutes        = require('./routes/auth.routes');

// MongoDB
require('./databases/mongo.database');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// const corsOption = {
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//     methods: ["GET", "POST", "DELETE","PUT","PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization", "Accept"],
//     preflightContinue: false,
// };

app.all("*", (req, res, next) => {
  let origin = req.get("origin");

  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS,PATCH"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Route par default de l'API
app.get('/', (req, res) => {
    res.status(200).json(
        {
            message: 'Route par défaut - Failleware',
        }
    );
});




// Routes de l'API
app.use('/api/riot',    riotRoutes);
app.use('/api/fiware',  fiwareRoutes);
app.use('/api/user',    userRoutes);

app.listen(process.env.PORT, () => {
    console.log("Serveur démarré sur le port " + process.env.PORT);
})
