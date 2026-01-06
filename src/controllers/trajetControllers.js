const { geocoder } = require("../services/geocodingService");
const { calculerRoute } = require("../services/routingService");
const Reservation = require("../models/Reservations");
const Utilisateur = require("../models/Utilisateurs");

// 🔹 TARIFS (Provisoirs)
const TARIFS = {
    MOTO: {
        prixBase: 20000,
        tarifKm: 500,
        tarifDuree: 5,
        coefficient: 1.1,
    },
    TAXI: {
        prixBase: 5000,
        tarifKm: 400,
        tarifDuree: 10,
        coefficient: 1.1,
    },
    VOITURE: {
        prixBase: 6000,
        tarifKm: 450,
        tarifDuree: 12,
        coefficient: 1.15,
    },
    };

    // ÉTAPE 1 — distance + durée
    exports.calculerTrajet = async (req, res) => {
    try {
        const { depart, destination } = req.body;

        if (!depart || !destination) {
        return res.status(400).json({
            succes: false,
            message: "Départ et destination sont obligatoires",
        });
        }

        const coordDepart = await geocoder(depart);
        const coordDestination = await geocoder(destination);

        const { distanceKm, dureeMin } = await calculerRoute(
        coordDepart,
        coordDestination
        );

        return res.status(200).json({
        succes: true,
        trajet: {
            depart,
            destination,
            distanceKm: Number(distanceKm.toFixed(1)),
            dureeMin: Math.round(dureeMin),
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
    };

    // ÉTAPE 2 — calcul du prix
    exports.calculerPrixTrajet = async (req, res) => {
    try {
        const { depart, destination, typeVehicule } = req.body;

        if (!depart || !destination || !typeVehicule) {
        return res.status(400).json({
            succes: false,
            message: "Départ, destination et type de véhicule sont obligatoires",
        });
        }

        const tarif = TARIFS[typeVehicule];
        if (!tarif) {
        return res.status(400).json({
            succes: false,
            message: "Type de véhicule invalide",
        });
        }

        const coordDepart = await geocoder(depart);
        const coordDestination = await geocoder(destination);

        const { distanceKm, dureeMin } = await calculerRoute(
        coordDepart,
        coordDestination
        );

        let prix =
        tarif.prixBase +
        distanceKm * tarif.tarifKm +
        dureeMin * tarif.tarifDuree;

        prix *= tarif.coefficient;

        return res.status(200).json({
        succes: true,
        trajet: {
            depart,
            destination,
            distanceKm: Number(distanceKm.toFixed(1)),
            dureeMin: Math.round(dureeMin),
            typeVehicule,
            prix: Math.round(prix),
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// HISTORIQUE DES TRAJETS (PASSAGER
exports.mesTrajets = async (req, res) => {
    try {
        const trajets = await Reservation.find({
        passager: req.utilisateur._id,
        })
        .sort({ createdAt: -1 })
        .populate("chauffeur", "nom prenom telephone");

        return res.status(200).json({
        succes: true,
        total: trajets.length,
        trajets,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// FACTURES
exports.factureTrajet = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id)
        .populate("chauffeur", "nom prenom telephone")
        .populate("passager", "nom prenom telephone");

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Trajet introuvable",
        });
        }

        // Seul le passager peut voir sa facture
        if (
        reservation.passager._id.toString() !==
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Accès refusé",
        });
        }

        // Conditions facture
        if (
        reservation.statut !== "TERMINEE" ||
        reservation.paiement?.statut !== "PAYE"
        ) {
        return res.status(400).json({
            succes: false,
            message: "La facture n’est pas encore disponible",
        });
        }

        // STRUCTURE FACTURE
        const facture = {
        numeroFacture: `FACT-${reservation._id}`,
        date: reservation.dateFin,
        passager: reservation.passager,
        chauffeur: reservation.chauffeur,
        trajet: {
            depart: reservation.depart,
            destination: reservation.destination,
            distanceKm: reservation.distanceKm,
            dureeMin: reservation.dureeMin,
            typeVehicule: reservation.typeVehicule,
        },
        paiement: reservation.paiement,
        montant: reservation.prix,
        };

        return res.status(200).json({
        message: "=====FACTURES DU PAIEMENT=====",
        succes: true,
        facture,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// RECHERCHER UN TRAJET (PASSAGER)
exports.rechercherTrajet = async (req, res) => {
    try {
        const { depart, destination, typeVehicule } = req.body;

        if (!depart || !destination || !typeVehicule) {
        return res.status(400).json({
            succes: false,
            message: "Départ, destination et type de véhicule sont obligatoires",
        });
        }
        // Vérifier le type de véhicule
        const tarif = TARIFS[typeVehicule];
        if (!tarif) {
        return res.status(400).json({
            succes: false,
            message: "Type de véhicule invalide",
        });
        }
        // Géocodage
        const coordDepart = await geocoder(depart);
        const coordDestination = await geocoder(destination);

        // Calcul distance + durée
        const { distanceKm, dureeMin } = await calculerRoute(
        coordDepart,
        coordDestination
        );

        // Calcul du prix estimatif
        let prix =
        tarif.prixBase +
        distanceKm * tarif.tarifKm +
        dureeMin * tarif.tarifDuree;

        prix *= tarif.coefficient;

        return res.status(200).json({
        message: "=====INFORMATIONS SUR LE TRAJET=====",
        succes: true,
        trajet: {
            depart,
            destination,
            distanceKm: Number(distanceKm.toFixed(1)),
            dureeMin: Math.round(dureeMin),
            typeVehicule,
            prixEstime: Math.round(prix),
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};