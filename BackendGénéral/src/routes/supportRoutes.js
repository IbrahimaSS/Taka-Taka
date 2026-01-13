const express = require("express");
const router = express.Router();

const supportController = require("../controllers/supportController");
const { verifierToken } = require("../middlewares/authMiddlewares");
const { autoriserRoles } = require("../middlewares/roleMiddlewares");
const {verifierStatutActif} = require("../middlewares/statutMiddlewares");

// Contacter le support
router.post("/contact", verifierToken, verifierStatutActif, supportController.creerTicket);

// Voir mes tickets support
router.get("/mes-tickets", verifierToken, verifierStatutActif, supportController.mesTickets);

// Changer statut ticket
router.put("/:id/statut", verifierToken, autoriserRoles("ADMIN"), supportController.changerStatut);

module.exports = router;
