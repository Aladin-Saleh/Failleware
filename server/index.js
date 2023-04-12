const dotenv            = require('dotenv').config({ path: './config/.env' });

const express           = require('express');
const app               = express();

const bodyParser        = require('body-parser');
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

app.listen(process.env.PORT, () => {
    console.log("Serveur démarré sur le port " + process.env.PORT);
})
