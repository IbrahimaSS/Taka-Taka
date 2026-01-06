const Reservation = require("../models/Reservations");

// CRÉER RÉSERVATION (PASSAGER)
exports.creerReservation = async (req, res) => {
    try {
        const {
        depart,
        destination,
        distanceKm,
        dureeMin,
        typeVehicule,
        prix,
        } = req.body;

        // CRÉATION DE LA RÉSERVATION
        // Pas de paiement
        const reservation = await Reservation.create({
        passager: req.utilisateur._id,
        depart,
        destination,
        distanceKm,
        dureeMin,
        typeVehicule,
        prix,
        });

        return res.status(201).json({
        message: "===== DEMANDE ENVOYÉE AVEC SUCCÈS =====",
        succes: true,
        reservation,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
    };

// ACCEPTER RÉSERVATION (CHAUFFEUR)
    exports.accepterReservation = async (req, res) => {
    try {
        const { id } = req.params;

        // RÉCUPÉRER LA RÉSERVATION AVANT MODIFICATION
        const reservation = await Reservation.findById(id);

        if (!reservation || reservation.statut !== "EN_ATTENTE") {
        return res.status(400).json({
            succes: false,
            message: "Cette réservation n’est plus disponible",
        });
        }

        // EMPÊCHER LE PASSAGER D’ACCEPTER SA PROPRE RÉSERVATION
        if (
        reservation.passager.toString() ===
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Vous ne pouvez pas accepter votre propre réservation",
        });
        }

        // SEUL UN CHAUFFEUR PEUT ACCEPTER
        if (req.utilisateur.role !== "CHAUFFEUR") {
        return res.status(403).json({
            succes: false,
            message: "Seuls les chauffeurs peuvent accepter une réservation",
        });
        }

        // ATTRIBUTION DU CHAUFFEUR
        reservation.chauffeur = req.utilisateur._id;
        reservation.statut = "ACCEPTEE";

        await reservation.save();

        return res.status(200).json({
        message: "===== RÉSERVATION ACCEPTÉE AVEC SUCCÈS =====",
        succes: true,
        reservation,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
    };

// DÉMARRER LE TRAJET (CHAUFFEUR)
    exports.demarrerTrajet = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id);

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Réservation introuvable",
        });
        }

        // SEUL LE CHAUFFEUR PEUT DÉMARRER
        if (
        reservation.chauffeur.toString() !==
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Vous n’êtes pas le chauffeur de ce trajet",
        });
        }

        if (reservation.statut !== "ACCEPTEE") {
        return res.status(400).json({
            succes: false,
            message: "Le trajet ne peut pas être démarré",
        });
        }

        reservation.statut = "EN_COURS";
        reservation.dateDebut = new Date();

        await reservation.save();

        return res.status(200).json({
        message: "===== TRAJET BIEN DÉMARRÉ =====",
        succes: true,
        reservation,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
    };

// TERMINER LE TRAJET (CHAUFFEUR)
    // LE PAIEMENT NAÎT ICI SEULEMENT
    exports.terminerTrajet = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id);

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Réservation introuvable",
        });
        }

        // SEUL LE CHAUFFEUR PEUT TERMINER
        if (
        reservation.chauffeur.toString() !==
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Vous n’êtes pas le chauffeur de ce trajet",
        });
        }

        if (reservation.statut !== "EN_COURS") {
        return res.status(400).json({
            succes: false,
            message: "Le trajet n’est pas en cours",
        });
        }

        reservation.statut = "TERMINEE";
        reservation.dateFin = new Date();

        // CRÉATION DU PAIEMENT (PAS AVANT)
        reservation.paiement = {
        statut: "EN_ATTENTE",
        methode: null,
        reference: null,
        };

        await reservation.save();

        return res.status(200).json({
        message: "===== TRAJET TERMINÉ AVEC SUCCÈS =====",
        succes: true,
        reservation,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
    };

// INITIER PAIEMENT ORANGE MONEY / MTN MONEY (PASSAGER)
exports.initierPaiementMobileMoney = async (req, res) => {
    try {
        const { id } = req.params;
        const { methode, telephone } = req.body;

        const reservation = await Reservation.findById(id);

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Réservation introuvable",
        });
        }
        // SEUL LE PASSAGER
        if (
        reservation.passager.toString() !==
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Accès refusé",
        });
        }

        if (
        reservation.statut !== "TERMINEE" ||
        reservation.paiement.statut !== "EN_ATTENTE"
        ) {
        return res.status(400).json({
            succes: false,
            message: "Paiement non autorisé",
        });
        }

        if (!["ORANGE_MONEY", "MTN_MONEY"].includes(methode)) {
        return res.status(400).json({
            succes: false,
            message: "Méthode invalide",
        });
        }

        if (!telephone) {
        return res.status(400).json({
            succes: false,
            message: "Numéro de téléphone obligatoire",
        });
        }
        // SIMULATION API MOBILE MONEY
        // PLUS TARD L'API OM / MTN
        const reference = `MM-${Date.now()}`;

        reservation.paiement = {
        statut: "EN_ATTENTE_CONFIRMATION",
        methode,
        telephone, // NUMÉRO SAISI PAR LE PASSAGER
        reference,
        };

        await reservation.save();
        return res.status(200).json({
        message: "===== DEMANDE DE PAIEMENT ENVOYÉE =====",
        succes: true,
        paiement: reservation.paiement,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// CONFIRMER PAIEMENT (SIMULATION CALLBACK OM / MTN)
    exports.confirmerPaiement = async (req, res) => {
    try {
        const { reference } = req.body;

        const reservation = await Reservation.findOne({
        "paiement.reference": reference,
        "paiement.statut": "EN_ATTENTE_CONFIRMATION",
        });

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Paiement introuvable",
        });
        }

        reservation.paiement.statut = "PAYE";

        await reservation.save();

        return res.status(200).json({
        message: "===== PAIEMENT CONFIRMÉ AVEC SUCCÈS =====",
        succes: true,
        reservation,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
    };

// PAIEMENT CASH (PASSAGER)
    exports.payerReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { methode } = req.body;

        const reservation = await Reservation.findById(id);

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Réservation introuvable",
        });
        }

        if (
        reservation.passager.toString() !==
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Vous n’êtes pas le passager",
        });
        }

        if (
        reservation.statut !== "TERMINEE" ||
        reservation.paiement?.statut !== "EN_ATTENTE"
        ) {
        return res.status(400).json({
            succes: false,
            message: "Paiement non autorisé",
        });
        }

        // CASH UNIQUEMENT ICI
        if (methode && methode !== "CASH") {
        return res.status(400).json({
            succes: false,
            message: "Utilisez Mobile Money pour cette méthode",
        });
        }

        reservation.paiement.statut = "PAYE";
        reservation.paiement.methode = "CASH";

        await reservation.save();

        return res.status(200).json({
        message: "===== PAIEMENT CASH EFFECTUÉ AVEC SUCCÈS =====",
        succes: true,
        reservation,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// REÇU / FACTURE (PASSAGER)
exports.recuReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id)
        .populate("passager", "nom prenom telephone")
        .populate("chauffeur", "nom prenom");

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Réservation introuvable",
        });
        }

        // SEUL LE PASSAGER
        if (
        reservation.passager._id.toString() !==
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Accès refusé",
        });
        }

        if (
        reservation.statut !== "TERMINEE" ||
        reservation.paiement?.statut !== "PAYE"
        ) {
        return res.status(400).json({
            succes: false,
            message: "Reçu non disponible",
        });
        }

        return res.status(200).json({
        succes: true,
        recu: {
            reference: reservation.paiement.reference,
            date: reservation.updatedAt,
            passager: reservation.passager,
            chauffeur: reservation.chauffeur,
            trajet: {
            depart: reservation.depart,
            destination: reservation.destination,
            distanceKm: reservation.distanceKm,
            dureeMin: reservation.dureeMin,
            },
            paiement: {
            methode: reservation.paiement.methode,
            montant: reservation.prix,
            },
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// RESERVATION PRE-REMPLI
exports.reservationDepuisRecherche = async (req, res) => {
    try {
        const {
        depart,
        destination,
        distanceKm,
        dureeMin,
        typeVehicule,
        prix,
        } = req.body;

        // Validation minimale
        if (
        !depart ||
        !destination ||
        !distanceKm ||
        !dureeMin ||
        !typeVehicule ||
        !prix
        ) {
        return res.status(400).json({
            succes: false,
            message: "Données de trajet incomplètes",
        });
        }

        // Création réservation
        const reservation = await Reservation.create({
        passager: req.utilisateur._id,
        depart,
        destination,
        distanceKm,
        dureeMin,
        typeVehicule,
        prix,
        statut: "EN_ATTENTE",
        });

        return res.status(201).json({
        message: "===== RÉSERVATION CRÉÉE AVEC SUCCÈS =====",
        succes: true,
        reservation,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

