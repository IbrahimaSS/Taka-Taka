const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
    {
        utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utilisateur",
        required: true,
        },
        nom: {
        type: String,
        required: true,
        },
        prenom: {
        type: String,
        required: true,
        },
        sujet: {
        type: String,
        required: true,
        trim: true,
        },
        message: {
        type: String,
        required: true,
        trim: true,
        },
        statut: {
        type: String,
        enum: ["OUVERT", "EN_COURS", "FERME"],
        default: "OUVERT",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Support", supportSchema);
