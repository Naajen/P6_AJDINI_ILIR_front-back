const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//création d'un compte
exports.signup = (req, res, next) => {
    //bcryt hash le mdp dans la BdD mongoDB
    bcrypt.hash(req.body.password, 10) //il hash 10x  le mot de passe il est modifiable fonction du trafic sur le site 100 pour un petit trafic
    .then( hash => {
        const user = new User({ 
            email: req.body.email,
            password: hash
        });
        user.save()
        .then( () => res.status(201).json({ message: 'Utilisateur à bien été créé !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//connecte un user existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //recupère l'user qui est dans la BdD avec l'email
    .then( user => {
        if (!user) {
            //si on reçoit pas d'user on renvoi une erreur
            return res.status(401).json({ error: 'User inexistant' });
        }
        bcrypt.compare( req.body.password, user.password) //compare le hash entré avec le hash BdD
        .then( valid => {
            if (!valid) {
                //si comparaison nul on envoi une erreur
                return res.status(401).json({ error: 'Mdp incorrect' });
            }
            res.status(200).json({
                //si comparaison bonne on envoi un token au frontend
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'} //après 24h le token n'est plus valable
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch( error => res.status(500).json({ error }));
};