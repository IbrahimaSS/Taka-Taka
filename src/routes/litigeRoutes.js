const express = require("express");
const router = express.Router();
const litigeController = require("../controllers/litigeControllers");
const { verifierToken } = require("../middlewares/authMiddlewares");
const {verifierStatutActif} = require("../middlewares/statutMiddlewares");

// Signaler un litige
router.post("/:id", verifierToken, verifierStatutActif, litigeController.signalerLitige);

// Bouton urgence
router.post("/urgence/:id", verifierToken, verifierStatutActif, litigeController.declencherUrgence);

// Historique des litiges du passager
router.get("/mes-litiges", verifierToken, verifierStatutActif, litigeController.mesLitiges);


module.exports = router;
