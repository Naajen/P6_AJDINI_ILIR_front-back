//importation password-validator
const passwordValidator = require("password-validator");

//création du schéma comme mongoDB
const passwordSchema = new  passwordValidator();

//Ce que le mdp doit respecter comme schéma
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters Majuscule
.has().lowercase()                              // Must have lowercase letters Minuscule
.has().digits(2)                                // Must have at least 2 digits chiffre
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values, Trier les mdp type trop facile comme azerty

//export
module.exports = passwordSchema;