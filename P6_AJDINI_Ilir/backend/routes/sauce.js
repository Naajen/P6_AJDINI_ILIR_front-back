//importation de toutes les conditions pour acceder au route
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const sauceCtrl = require("../controllers/sauce");
const multer = require("../middleware/multer-config");

//Le router "get" passe par "l'authentification avoir l'id de celui qui est connecté / getAllSauces" pour qu'il puisse voir toutes les sauces disponnible sur le site
router.get("/", auth, sauceCtrl.getAllSauces);
//Le router "Post" passe par multer(indique le chemin d'enregistrement des fichiers) / createSauce" pour qu'il puisse intéragir et créer un objet dans la BdD
router.post("/", auth, multer, sauceCtrl.createSauce);
//Le router "get" affiche 1 seul sauce grâce au controller getOneSauce pour agir
router.get("/:id", auth, sauceCtrl.getOneSauce);
//Le router "put" permet à celui qui à créer un objet de pouvoir le modifier
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//Le router "delete" permet à celui qui à créer un objet de pouvoir le supprimer
router.delete("/:id", auth, sauceCtrl.deleteSauce);
//Ce router "post" permet de pouvoir avoir une intéraction sur la satisfaction de l'objet grâce au "likeAndDislike"
router.post("/:id/like", auth, sauceCtrl.likeAndDislike);

//exportation
module.exports = router;