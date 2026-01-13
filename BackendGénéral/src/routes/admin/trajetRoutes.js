const express = require("express");
const router = express.Router();

const { verifierToken } = require("../../middlewares/authMiddlewares");
const { autoriserRoles } = require("../../middlewares/roleMiddlewares");
const trajetController = require("../../controllers/admin/trajetControllers");


// ================================== TRAJETS ===================================
//Cards Trajets
router.get(
    "/trajets/stats",
    verifierToken,
    autoriserRoles("ADMIN"),
    trajetController.statsTrajets
);
//Map (Carte)
router.get(
    "/trajets/map",
    verifierToken,
    autoriserRoles("ADMIN"),
    trajetController.trajetsCarte
);
//Detail d'un trajet (👁️)
router.get(
    "/trajets/:id",
    verifierToken,
    autoriserRoles("ADMIN"),
    trajetController.detailTrajet
);
//Listes des trajets
router.get(
    "/trajets",
    verifierToken,
    autoriserRoles("ADMIN"),
    trajetController.tousLesTrajets
);

module.exports = router;