const express = require("express");
const router = express.Router();

const { verifierToken } = require("../../middlewares/authMiddlewares");
const { autoriserRoles } = require("../../middlewares/roleMiddlewares");
const { upload } = require("../../middlewares/upload");
const {
  updateVehicule,
  uploadDocuments,
} = require("../../controllers/chauffeur/profileControllers");

router.put(
  "/vehicule",
  verifierToken,
  autoriserRoles("CHAUFFEUR"),
  updateVehicule
);

router.post(
  "/documents",
  verifierToken,
  autoriserRoles("CHAUFFEUR"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
    { name: "carRegistration", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
  ]),
  uploadDocuments
);

module.exports = router;
