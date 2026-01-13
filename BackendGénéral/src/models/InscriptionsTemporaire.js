const mongoose = require("mongoose");

const inscriptionTemporaireSchema = new mongoose.Schema(
    {
        nom: String,
        prenom: String,
        telephone: { type: String, required: true },
        email: String,
        motDePasse: String,
        typeProfil: String,
        genre: String,

        otpVerifie: {
        type: Boolean,
        default: false,
        },

        expireA: {
        type: Date,
        required: true,
        },
    },
    { timestamps: true }
    );

    module.exports = mongoose.model(
    "InscriptionTemporaire",
    inscriptionTemporaireSchema
);
