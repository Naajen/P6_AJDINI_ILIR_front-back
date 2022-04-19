const Sauce = require("../models/Sauce");
const fs = require("fs");

//trouve toutes les sauce dispo sur le site si sauce il y a
exports.getAllSauces = (req, res, next) => {
  //retourne tout les "objets"
  Sauce.find()
    .then((sauces) => {res.status(200).json(sauces);})
    .catch((error) => {res.status(400).json({error: error,});
    });
};

//Ajout d'une sauce dans la BdD
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject, // ... spread opérator / dégradé d'un tableau dans les variable
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  sauce
    .save() //methode save permet d'enregistrer un objet dans la BdD et renvoie une promise
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error })); //renvoie une erreur générée par Mongoose
};

//findOne() Retourne un seul objet basé sur la fonction de comparaison qu'on lui passe (souvent pour récup un objet par son id)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id,})
    .then((sauce) => {res.status(200).json(sauce);})
    .catch((error) => {res.status(404).json({error: error,});
    });
};

//modification du contenu
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id}).then((sauce) => {
    if (!sauce) {
      return res.status(404).json ({error:"Sauce not found sorry !"});
    }
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json ({error: "Authentification non valide"});
    }
    //Ne garde pas l'ancienne image si elle est remplacer
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, ()=> console.log("image supprimé"))
    
    const sauceObject = req.file
      ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
        }`,
      }
      : { ...req.body };
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
      .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
      .catch((error) => res.status(403).json({ error }));
  });
};  
//supprime une sauce selons l'id de celui qui le supprime
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id:req.params.id})
  .then((sauce) => {
    if (!sauce) {
      return res.status(404).json ({
        error: "Sauce not found",
      });
    }
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json({
        error: "Authentification non valide"
      });
    }
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
      .then(() =>
        res.status(200).json({ message: "Sauce supprimé !" })
      )
      .catch((error) => res.status(400).json({ error }));
    });
  })
  .catch((error) => res.status(400).json ({error}))
};

//like & dislike
exports.likeAndDislike = (req, res, next) => {
  let userId = req.body.userId;
  let likeOne = req.body.like;
  let sauceId = req.params.id;
  //console.log(likeOne);
  // Le "LikeOne" possède 3 paramètrage +1 / 0 / -1 donc un switch est idéal ici
  switch (likeOne) {
    //Si l'utilisateur aime la sauce +1 like 
    //Case 1 = +1, on ajoute grâce l'opérateur $inc +1 dans le tableau du schema qui est dans la BdD
    //Opérateur $push envoi dans le schéma de la BdD l'userId dans le usersliked
    case 1 : 
      Sauce.updateOne({ _id:sauceId },
        { 
          $inc: {likes: +1},
          $push: {usersLiked: userId}
        }
      )
      .then(() => res.status(200).json({ message: 'Likeeeeed Yeaaahhh !' }))
      .catch((error) => res.status(400).json({ error }))
    break;
    //Si l'utilisateur n'aime pas la sauce
    //case -1 le tableau dislikes ajoute +1
    //opérateur $push envoi dans le schéma de la BdD l'userId dans le usersdisliked 
    case -1 :
      Sauce.updateOne({ _id:sauceId }, 
        { 
          $push: { usersDisliked: userId }, 
          $inc: { dislikes: +1 }
        })
      .then(() => { res.status(200).json({ message: 'Oh non Disliked Saaaad' }) })
      .catch((error) => res.status(400).json({ error }))
    break;
    //le break met fin au case
    
    //Si l'utilisateur veut retirer sont vote positif ou négatif pour revenir à zéro
    //opérateur $pull retire l'userId du tableau présent dans le schéma usersliked ou disliked
    case 0 :
    Sauce.findOne({ _id:sauceId })
      .then((sauce) => {

        if (sauce.usersLiked.includes(userId)) {
        Sauce.updateOne({ _id: sauceId}, 
          { 
            $pull: { usersLiked: userId }, 
            $inc: { likes: -1 }
          })
        .then(() => res.status(200).json({ message: 'Aie la sauce pique trop ?' }))
        .catch((error) => res.status(400).json({ error }))
        }
        if (sauce.usersDisliked.includes(userId)) {
        Sauce.updateOne({ _id: sauceId }, 
          { 
            $inc: { dislikes : -1 },
            $pull: { usersDisliked: userId }
          })
        .then(() => res.status(200).json({ message: 'Ah ! peut être un changement positif ?' }))
        .catch((error) => res.status(400).json({ error }))
        }
      })
    .catch((error) => res.status(404).json({ error }))
    break;
  
    default:
      console.log(error);
  }
};

/* 
    //mise en place d'un switch on veut controler la valeur du like
    //méthode includes() les array usersLiked ou usersDisliked
    const userLike = sauce.usersLiked.includes(userId);
    //si le userdId à déjà voter il ne peut revoter une 2eme fois
        //si l'userid est deja présent dans le userliked supprime son like
    if(!userLike && likeOne === 1) {
      //MàJ BdD
      Sauce.updateOne(
        { _id: req.params.id },
        //opérateur $inc incrémente les valeurs +1
        //opérateur $push envoi userid dans le tableau usersLiked
        { 
          $inc: {likes:1},
          $push: {usersLiked: userId}
        }
      )
      .then(() => res.status(201).json({ message: "Liked OneUp !"}))
      .catch((error) => res.status(400).json({error}))
    }
    //si l'userid est deja présent dans le userliked supprime son like
    if(userLike && likeOne === 0) {
      //MàJ BdD
      Sauce.updateOne(
        { _id: req.params.id },
        //opérateur $inc incrémente ou décrémente les valeurs ici -1
        //opérateur $pull supprime l'userid dans le tableau usersLiked
        { 
          $inc: {likes:-1},
          $pull: {usersLiked: userId}
        }
      )
      .then(() => res.status(201).json({ message: "Like supprimé !"}))
      .catch((error) => res.status(400).json({error}))
    }
*/
