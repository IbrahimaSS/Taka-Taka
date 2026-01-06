const express = require("express");
const router = express.Router();
const { verifierToken } = require("../middlewares/authMiddlewares");
const notificationController = require("../controllers/notificationControllers");
const {verifierStatutActif} = require("../middlewares/statutMiddlewares");

router.get("/mes-notifications", verifierToken, verifierStatutActif, notificationController.mesNotifications);

module.exports = router;
