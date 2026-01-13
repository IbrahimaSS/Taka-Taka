const express = require("express");
const router = express.Router();
const trajetController = require("../controllers/trajetControllers");
const { verifierToken } = require("../middlewares/authMiddlewares");
const { autoriserRoles } = require("../middlewares/roleMiddlewares");
const {verifierStatutActif} = require("../middlewares/statutMiddlewares");

// Étape 1 : calcul du trajet (distance + durée)
router.post("/calculer", verifierToken, verifierStatutActif, trajetController.calculerTrajet);
// Étape 2 : calcul du prix selon le véhicule
router.post("/prix", verifierToken, verifierStatutActif, trajetController.calculerPrixTrajet);
// Listes des Trajets
router.get("/mes-trajets", verifierToken, verifierStatutActif, trajetController.mesTrajets);
// Factures
router.get("/facture/:id", verifierToken, verifierStatutActif, trajetController.factureTrajet);
// Rechercher un trajet (avant réservation)
router.post("/rechercher", verifierToken, verifierStatutActif, autoriserRoles("PASSAGER"), trajetController.rechercherTrajet);




module.exports = router;
