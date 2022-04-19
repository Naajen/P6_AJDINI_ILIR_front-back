//npm i express + importation + app = express
const express = require('express');
//npm i mongoose + importation + connection à la base de données via le mongoose.connect
const mongoose = require('mongoose');
//importation de la route de verif des users
const userRoutes = require('./routes/user');
//importation de la route de verif des sauces
const saucesRoutes = require("./routes/sauce");
//path = voie pour multer
const path = require("path");
//dotenv config pratique pour éviter les mdp dans le code en cas de configuration
require('dotenv').config();
//ratelimiter permet une protection contre le brute force il imposera une limitation de requete de mdp 
const rateLimit = require('express-rate-limit');

/*************************************************************** HELMET npm i helmet *****************************************************************************
*- CSP => Protection contre les attaques type cross-site scripting et autres injections intersites
*- hidePoweredBy => Supprime l'en-tête X-powered-by (vulnérabilités connues dans express/node si le site est alimenté par express)
*- hsts => définit l'en-tête Strict-Transport-Security qui impose des connexions (http sur SSL/TLS) sécurisées au serveur.
*- ieNoOpen => définit le X-Download-Options pour le IE8+ (Certaines applications Web serviront du code HTML non approuvé pour le téléchargement. 
*  Par défaut, certaines versions d'IE vous permettront d'ouvrir ces fichiers HTML)
*- noCache => définit des en-têtes Cache-Control et Pragma pour désactiver la mise en cache côté client.
*- noSniff =>  définit X-Content-Type-Options pour protéger les navigateurs du reniflage du code MIME d’une réponse à partir du type de contenu déclaré. 
* (Problème de confidentialité, difficilement détectable, vérifie l'utilation du réseau de l'user, capture tous les paquets sur un réseau, Enregistre les données 
* des paquets capturés dans un fichiers, Analyse les données enregistrées pour trouver des info de connexion, mdp, id etc.)
*- frameguard => définit l’en-tête X-Frame-Options pour fournir une protection clickjacking. (Clikjacking détournement sur le clic <iframe>link</iframe>)
*- xssFilter => définit X-XSS-Protection afin d’activer le filtre de script intersites (XSS) dans les navigateurs Web les plus récents.
******************************************************************************************************************************************************************/
const helmet = require('helmet')


//password est caché dans le fichier .env et faire appel au process ensuite / surtout mettre le ".env" dans le .gitignore pour le pas le renvoyé au github
mongoose.connect(process.env.MongoDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !')) //si la connection est bonne
.catch(() => console.log('Connexion à MongoDB échouée !')); //si la connection n'est pas bonne

//index du server
const app = express();

//pour évité net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin 200 il autorise le CORS (cross-origin resource sharing)
app.use(helmet({crossOriginResourcePolicy: false,}));

//retire les erreurs CORS / cross origin ressource sharing entre donne l'acces au partage de fichiers entre les localhost des serveurs
app.use((req, res, next) => {
    //Permet d'accéder à l'api depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Permet d'ajouter les headers mentionnée aux requêtes envoyées vers l'api
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Permet d'envoyer avec le CRUD (create => post, read => get, update => put, delete => delete) les plus importante
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //put et patch font sensiblement la meme chose
    next();
});
//Limitera les request contre le bruteforce
const limiter = rateLimit ({
    windowMs: 15 * 60 * 1000, // 15 minutes de "ban" pour pouvoir remttre son mdp, évite le bruteforce
    max: 10, // Limite chaque IP à 10 req par `window` (15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

//Intercepte les req content-type app/json et met leurs body à disposition app démarre av express
app.use(express.json());
//multer utilisation
app.use("/images", express.static(path.join(__dirname, "images")));
//utilisation de l'api de l'authentification
app.use('/api/auth', userRoutes);
//utilisation de l'api des sauces get/post/put/delete
app.use("/api/sauces", saucesRoutes);
//utilisation du limiter
app.use('/api', limiter)

//exportation du module app pour les autres fichiers
module.exports = app;