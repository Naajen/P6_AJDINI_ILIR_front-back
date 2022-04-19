//importation jsonwebtoken
const jwt = require('jsonwebtoken');

//création du mdlware qui protège les routes en vérifiant les token et refusant les connection non autorisé
module.exports = (req, res, next) => {
    try {
        //Les tokens d'authentification doivent être envoyés dans un header Authorization.
        const token = req.headers.authorization.split(' ')[1]; //on recupère le 2eme element du tableau [1]
        //vérifie le token d'entrée (user) et le token stocké (server)
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {userId};
        //si le token d'entrée n'est pas identique à celui à été créer alors rien
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valide';
        } else {
        //sinon c'est bon next !    
            next();
        }
    } catch (error) {
        res.status(401).json({ 
            error: error | 'requête non authentifiée !'
        });
    }
};