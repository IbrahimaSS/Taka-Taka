const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        passager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utilisateurs",
        required: true,
        },

        chauffeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utilisateurs",
        default: null,
        },

        depart: { type: String, required: true },
        destination: { type: String, required: true },

        distanceKm: { type: Number, required: true },
        dureeMin: { type: Number, required: true },

        typeVehicule: {
        type: String,
        enum: ["MOTO", "TAXI", "VOITURE", "BUS"],
        required: true,
        },

        prix: { type: Number, required: true },

        statut: {
        type: String,
        enum: ["EN_ATTENTE", "ACCEPTEE", "EN_COURS", "TERMINEE"],
        default: "EN_ATTENTE",
        },

        dateDebut: {
        type: Date,
        default: null,
        },

        dateFin: {
        type: Date,
        default: null,
        },

        // PAIEMENT : N'EXISTE QU'APRÈS TERMINEE
        paiement: {
            statut: {
                type: String,
                enum: ["EN_ATTENTE", "EN_ATTENTE_CONFIRMATION", "PAYE", "ECHEC"],
            },
            methode: {
                type: String,
                enum: ["CASH", "ORANGE_MONEY", "MTN_MONEY"],
                default: null,
            },
            telephone: {
                type: String,
                default: null, // NUMÉRO SAISI PAR LE PASSAGER
            },
            reference: {
                type: String,
                default: null, // id transaction OM / MTN
            },
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
