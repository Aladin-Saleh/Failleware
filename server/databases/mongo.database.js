const mongoose  = require('mongoose');


mongoose.connect(`mongodb://172.18.0.2:27017/`,{
    // Set the collection name
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((err) => console.log('Connexion à MongoDB échouée !', err));