const express = require("express");
const router = express.Router();
const { verifierToken } = require("../middlewares/authMiddlewares");
const reservationControllers = require("../controllers/reservationControllers");
const {verifierStatutActif} = require("../middlewares/statutMiddlewares");

// Étape 3 : confirmer et chercher chauffeur
router.post("/", verifierToken, verifierStatutActif, reservationControllers.creerReservation);

// Étape 4 : acceptation par un chauffeur
router.post("/:id/accepter", verifierToken, verifierStatutActif, reservationControllers.accepterReservation);

// Étape 5 : démarrer le trajet
router.post("/:id/demarrer", verifierToken, verifierStatutActif, reservationControllers.demarrerTrajet);

// Étape 6 : arrivée à destination + paiement
router.post("/:id/terminer", verifierToken, verifierStatutActif, reservationControllers.terminerTrajet);

// Etape 7 : Paiement
router.post("/:id/payer", verifierToken, verifierStatutActif, reservationControllers.payerReservation);
router.post("/:id/paiement/mobile", verifierToken, verifierStatutActif, reservationControllers.initierPaiementMobileMoney);
router.post("/paiement/confirmer", reservationControllers.confirmerPaiement);
router.get("/:id/recu", verifierToken, verifierStatutActif, reservationControllers.recuReservation
);
// Réservation depuis une recherche validée
router.post("/depuis-recherche", verifierToken, verifierStatutActif, reservationControllers.reservationDepuisRecherche);




module.exports = router;
