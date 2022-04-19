const mongoose = require('mongoose');

//Le model de schéma pour la BdD mongoDB
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, //alphanumérique lettre & chiffre
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});
  
//methode model le transforme en un modèle utilisable
module.exports = mongoose.model('Sauce', sauceSchema);