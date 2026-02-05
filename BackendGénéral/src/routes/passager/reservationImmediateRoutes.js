const express = require("express");
const router = express.Router();

const { confirmerReservationImmediate } = require("../../controllers/passager/reservationsImmediateControllers");
const { verifierToken } = require("../../middlewares/authMiddlewares");
const { verifierStatutActif } = require("../../middlewares/statutMiddlewares");

router.post(
    "/confirmer-immediate",
    verifierToken,
    verifierStatutActif,
    confirmerReservationImmediate
);

module.exports = router;
