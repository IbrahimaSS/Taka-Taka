// src/models/Paiement.js
const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema(
    {
        reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
        required: true,
        },

        montantTotal: {
        type: Number,
        required: true,
        },

        commissionPlateforme: {
        type: Number,
        required: true,
        },

        montantChauffeur: {
        type: Number,
        required: true,
        },

        statut: {
        type: String,
        enum: ["EN_ATTENTE", "PAYE", "ANNULE"],
        default: "EN_ATTENTE",
        },

        methode: {
        type: String,
        enum: ["CASH", "MTN_MONEY", "ORANGE_MONEY"],
        required: true,
        },
        verse: {
        type: Boolean,
        default: false
        },
        verseLe: {
        type: Date
        },
        versePar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utilisateurs"
        },
        commentaireVersement: {
        type: String
        }
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("Paiement", paiementSchema);
