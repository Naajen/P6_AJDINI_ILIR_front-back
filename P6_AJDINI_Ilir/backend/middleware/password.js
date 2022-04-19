//Importation du schéma
const passwordSchema = require('../models/password');

//création du mdlware de vérification
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        //ici j'ai juste laisser un message de ce que doit contenir un mdp, il serait préférable d'avoir une variable de ce qu'il manque
        return res.status(400).json({message : 'Votre mot de passe doit contenir au minimum 8 caractères, 1 majuscule et 2 chiffres'})
    }
}