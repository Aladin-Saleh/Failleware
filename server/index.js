const dotenv            = require('dotenv').config({ path: './config/.env' });

const express           = require('express');
const app               = express();

const bodyParser        = require('body-parser');
const riotRoutes        = require('./routes/riot.routes');
const fiwareRoutes      = require('./routes/fiware.routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// Route par default de l'API
app.get('/', (req, res) => {
    res.status(200).json(
        {
            message: 'Route par défaut - Failleware',
        }
    );
});

// Routes de l'API
app.use('/api/riot', riotRoutes);
app.use('/api/fiware', fiwareRoutes);

app.listen(process.env.PORT, () => {
    console.log("Serveur démarré sur le port " + process.env.PORT);
})
