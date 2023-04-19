const mongoose          = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema    = new mongoose.Schema({

    riotAccount : 
    {
        type: String,
        required: true,
        unique: true
    },

    login:
    {
        type: String,
        required: true,
        unique: true
    },

    password:
    {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 32
    },

    point:
    {
        type: Number,
        required: true,
        default: 0
    }

});


// Cryptage du mot de passe
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


userSchema.statics.login = async function(login, password) {
    const user = await this.findOne({ login });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        } 
        throw new Error('Mot de passe incorrect');
    }
    throw new Error('Utilisateur non trouvé');
}




const userModel = mongoose.model('user', userSchema);

module.exports = userModel;