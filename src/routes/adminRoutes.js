const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminControllers");
const { verifierToken } = require("../middlewares/authMiddlewares");
const { autoriserRoles } = require("../middlewares/roleMiddlewares");

router.get("/dashboard", verifierToken, autoriserRoles("ADMIN"), adminController.dashboard);
router.get("/trajets/recents", verifierToken, autoriserRoles("ADMIN"), adminController.trajetsRecents);
router.get("/trajets", verifierToken, autoriserRoles("ADMIN"), adminController.tousLesTrajets);

//=====================================PASSAGER=====================================

//Listes des Users
router.get(
    "/utilisateurs",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.listeUtilisateurs
);

// Cards (Stats)
router.get(
    "/utilisateurs/stats",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.statsUtilisateurs
);
// Détails d'un Passager
router.get(
    "/utilisateurs/:id",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.detailUtilisateur
);
// Activer - Désactiver - Suspendre un Compte
router.patch(
    "/utilisateurs/:id/statut",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.changerStatutUtilisateur
);

//=======================================CHAUFFEURS==================================
//Cards
router.get(
    "/chauffeurs/stats",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.statsChauffeurs
);
//Listes des Users
router.get(
    "/chauffeurs",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.listeChauffeurs
);
//Détails d'un Users
router.get(
    "/chauffeurs/:id",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.detailChauffeur
);
//Statut d'un Chauffeur
router.put(
    "/chauffeurs/:id/statut",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.changerStatutChauffeur
);

//=====================================DOCUMENTS====================================
// Cards des documents
router.get(
    "/documents/stats",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.statsDocuments
);
// Listes des documents
router.get(
    "/documents",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.listeDocuments
);
// Valider et Refuser un Document
router.patch(
    "/documents/:id/statut",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.changerStatutDocument
);
// Voir un Document
router.get(
    "/chauffeurs/:id/documents/",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.voirDocumentsChauffeur
);

// ================================== TRAJETS ===================================
router.get(
    "/trajets/stats",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.statsTrajets
);

//Map (Carte)
router.get(
    "/trajets/map",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.trajetsCarte
);

// Détail d'un trajet (👁️)
router.get(
    "/trajets/:id",
    verifierToken,
    autoriserRoles("ADMIN"),
    adminController.detailTrajet
);





module.exports = router;
