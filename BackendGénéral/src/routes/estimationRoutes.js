const express = require("express");
const router = express.Router();

const estimationController = require("../controllers/estimationController");
const { verifierToken } = require("../middlewares/authMiddlewares");
const { validerEstimation } = require("../validators/estimationValidator");
const {verifierStatutActif} = require("../middlewares/statutMiddlewares");

router.post("/", verifierToken, verifierStatutActif, validerEstimation, estimationController.estimerCourse);

module.exports = router;
