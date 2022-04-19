//Import multer qui est un package de gestion de fichiers / npm i multer
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//La méthode diskStorage indique à multer comment configurer le chemin et le nom des fichiers entrants (helmet le bloque)
const storage = multer.diskStorage({
  //la function destination indique à multer ou enregister
  destination: (req, file, callback) => {
    //Ici on lui indique images
    callback(null, "images");
  },
  // la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    //Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée. JPG PNG
    const extension = MIME_TYPES[file.mimetype];
    //Date.now() ajoute un timestamp = Horodatage // c'est un mecanique qui consiste à associer la date et l'heure à un event
    callback(null, name + Date.now() + "." + extension);
  },
});
//on l'export configuré, en lui demandant d'enregistré single/uniquement les images
module.exports = multer({ storage }).single("image");