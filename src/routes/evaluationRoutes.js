const express = require("express");
const router = express.Router();

const { verifierToken } = require("../middlewares/authMiddlewares");
const evaluationControllers = require("../controllers/evaluationControllers");
const {verifierStatutActif} = require("../middlewares/statutMiddlewares");

// NOTER UN CHAUFFEUR
router.post("/:reservationId", verifierToken, verifierStatutActif, evaluationControllers.noterChauffeur);
//Listes des Notes
router.get("/mes-evaluations", verifierToken, verifierStatutActif, evaluationControllers.mesEvaluations)

module.exports = router;
