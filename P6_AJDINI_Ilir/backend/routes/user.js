//importations
const express = require('express');
//importation du mdlware password
const passwordCtrl = require("../middleware/password")
//la fonction router()
const router = express.Router();

//importation du controllers/user.js
const userCtrl = require('../controllers/user');

//la route (endpoint) signup + le mdlware password doit avoir un mdp plus élaboré
router.post('/signup', passwordCtrl, userCtrl.signup);
//la route (endpoint) login
router.post('/login',  userCtrl.login);

//exportation du module
module.exports = router;