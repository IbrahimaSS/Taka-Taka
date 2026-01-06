const express = require("express");
const router = express.Router();

const utilisateurController = require("../controllers/utilisateurController");
const { verifierToken } = require("../middlewares/authMiddlewares");
const { validerInscription } = require("../validators/inscriptionValidators");
const {verifierStatutActif} = require("../middlewares/statutMiddlewares");

// Voir mon profil
router.get("/me", verifierToken, verifierStatutActif, utilisateurController.getProfil);

// Modifier mon profil
router.put("/me", validerInscription, verifierToken, verifierStatutActif, utilisateurController.updateProfil);

module.exports = router;
