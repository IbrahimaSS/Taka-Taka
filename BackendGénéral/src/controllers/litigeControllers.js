const Reservation = require("../models/Reservations");
const Litige = require("../models/Litiges");

// SIGNALER UN LITIGE (PASSAGER)
exports.signalerLitige = async (req, res) => {
    try {
        const { id } = req.params; // id réservation
        const { type, description } = req.body;

        const typesLitigeAutorises = [
        "PAIEMENT",
        "COMPORTEMENT",
        "TRAJET",
        "AUTRE",
        ];

        if (!typesLitigeAutorises.includes(type)) {
        return res.status(400).json({
            succes: false,
            message: "Type de litige invalide",
        });
        }

        const reservation = await Reservation.findById(id);

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Réservation introuvable",
        });
        }

        // seul le passager concerné
        if (
        reservation.passager.toString() !==
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Accès refusé",
        });
        }

        // autorisé pendant ou après le trajet
        if (!["EN_COURS", "TERMINEE"].includes(reservation.statut)) {
        return res.status(400).json({
            succes: false,
            message: "Impossible de signaler un litige à ce stade",
        });
        }

        // empêcher plusieurs litiges actifs
        const litigeExistant = await Litige.findOne({
        reservation: reservation._id,
        passager: req.utilisateur._id,
        statut: { $in: ["OUVERT", "EN_COURS"] },
        });

        if (litigeExistant) {
        return res.status(400).json({
            succes: false,
            message: "Un litige est déjà en cours pour ce trajet",
        });
        }

        const litige = await Litige.create({
        reservation: reservation._id,
        passager: reservation.passager,
        type,
        description,
        });

        return res.status(201).json({
        message: "===== LITIGE SIGNALÉ AVEC SUCCÈS =====",
        succes: true,
        litige,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
    };

// URGENCE (EN COURS DE TRAJET)
    exports.declencherUrgence = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, description } = req.body;

        const typesUrgenceAutorises = [
        "ACCIDENT",
        "AGRESSION",
        "URGENCE_MEDICALE",
        "DANGER",
        "AUTRE",
        ];

        if (!typesUrgenceAutorises.includes(type)) {
        return res.status(400).json({
            succes: false,
            message: "Type d’urgence invalide",
        });
        }

        const reservation = await Reservation.findById(id);

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Réservation introuvable",
        });
        }

        // seul le passager
        if (
        reservation.passager.toString() !==
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Accès refusé",
        });
        }

        // uniquement pendant le trajet
        if (reservation.statut !== "EN_COURS") {
        return res.status(400).json({
            succes: false,
            message: "L’urgence est disponible uniquement pendant le trajet",
        });
        }

        // empêcher plusieurs urgences / litiges actifs
        const litigeExistant = await Litige.findOne({
        reservation: reservation._id,
        passager: req.utilisateur._id,
        statut: { $in: ["OUVERT", "EN_COURS"] },
        });

        if (litigeExistant) {
        return res.status(400).json({
            succes: false,
            message: "Une alerte est déjà en cours pour ce trajet",
        });
        }

        const litige = await Litige.create({
        reservation: reservation._id,
        passager: reservation.passager,
        type,
        description: description || "🚨 Urgence signalée par le passager",
        });

        return res.status(201).json({
        message: "===== ALERTE URGENCE DÉCLENCHÉE =====",
        succes: true,
        litige,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
    };

// HISTORIQUE DES LITIGES (PASSAGER)
    exports.mesLitiges = async (req, res) => {
    try {
        const litiges = await Litige.find({
        passager: req.utilisateur._id,
        })
        .sort({ createdAt: -1 })
        .populate({
            path: "reservation",
            select: "depart destination statut dateDebut dateFin",
        })
        .select("-__v");

        return res.status(200).json({
        succes: true,
        total: litiges.length,
        litiges,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};
