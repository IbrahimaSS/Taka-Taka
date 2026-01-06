const Evaluation = require("../models/Evaluations");
const Reservation = require("../models/Reservations");
const Litige = require("../models/Litiges");

// NOTER LE CHAUFFEUR (PASSAGER)
exports.noterChauffeur = async (req, res) => {
    try {
        const { reservationId } = req.params;

        const {
        noteGlobale,
        details,
        commentaire,
        ressenti,
        pointsForts,
        } = req.body;

// RÉCUPÉRER LA RÉSERVATION
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
        return res.status(404).json({
            succes: false,
            message: "Réservation introuvable",
        });
        }

        // SEUL LE PASSAGER PEUT NOTER
        if (
        reservation.passager.toString() !==
        req.utilisateur._id.toString()
        ) {
        return res.status(403).json({
            succes: false,
            message: "Vous ne pouvez pas noter ce trajet",
        });
        }

        // LE TRAJET DOIT ÊTRE TERMINÉ
        if (reservation.statut !== "TERMINEE") {
        return res.status(400).json({
            succes: false,
            message: "Le trajet n’est pas terminé",
        });
        }

        // LE PAIEMENT DOIT ÊTRE EFFECTUÉ
        if (reservation.paiement?.statut !== "PAYE") {
        return res.status(400).json({
            succes: false,
            message: "Le paiement n’a pas encore été effectué",
        });
        }

        // BLOQUER LA NOTATION S’IL EXISTE UN LITIGE ACTIF
        const litigeActif = await Litige.findOne({
        reservation: reservationId,
        statut: { $in: ["OUVERT", "EN_COURS"] },
        });

        if (litigeActif) {
        return res.status(400).json({
            succes: false,
            message:
            "Notation bloquée : un litige est en cours pour ce trajet",
        });
        }

        // EMPÊCHER LA DOUBLE NOTATION
        const dejaNote = await Evaluation.findOne({
        reservation: reservationId,
        });

        if (dejaNote) {
        return res.status(400).json({
            succes: false,
            message: "Ce trajet a déjà été noté",
        });
        }

// CRÉATION DE L'ÉVALUATION
        const evaluation = await Evaluation.create({
        reservation: reservation._id,
        passager: reservation.passager,
        chauffeur: reservation.chauffeur,
        noteGlobale,
        details,
        commentaire,
        ressenti,
        pointsForts,
        });

        return res.status(201).json({
        message: "===== ÉVALUATION ENVOYÉE AVEC SUCCÈS =====",
        succes: true,
        evaluation,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// HISTORIQUE DES ÉVALUATIONS DONNÉES (PASSAGER)
exports.mesEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({
        passager: req.utilisateur._id,
        })
        .sort({ createdAt: -1 })
        .populate("chauffeur", "nom prenom")
        .select("-__v");

        return res.status(200).json({
        message: "===== MES EVALUATIONS =====",
        succes: true,
        total: evaluations.length,
        evaluations,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

