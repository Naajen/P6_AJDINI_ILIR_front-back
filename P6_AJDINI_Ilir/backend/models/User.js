//import mongoose
const mongoose = require('mongoose');
//uniqueValidator permet d'évité le spam d'un mail similaire / npm install --save mongoose-unique-validator
const uniqueValidator = require ('mongoose-unique-validator');

//création du schéma à envoyé a mongoDB
const userSchema = mongoose.Schema({
    email: { type: String, require:true, unique:true}, //1 mail seulement peut être inscrit grâce au unique
    password: { type: String, required:true}
});
//on applique le uniqueValidator sur le schéma pour qu'il identifie les mails similaire pour interdir plusieurs compte
userSchema.plugin(uniqueValidator);

//export
module.exports = mongoose.model('User', userSchema);