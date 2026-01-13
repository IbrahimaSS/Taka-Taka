const mongoose = require("mongoose");

// MODÈLE UTILISATEUR
const utilisateurSchema = new mongoose.Schema(
    {
        nom: {
        type: String,
        required: true,
        trim: true,
        },
        prenom: {
        type: String,
        required: true,
        trim: true,
        },
        telephone: {
        type: String,
        required: true,
        unique: true,
        },
        email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        },
        motDePasse: {
        type: String,
        required: true,
        },
        role: {
        type: String,
        enum: ["PASSAGER", "CHAUFFEUR", "ADMIN"],
        default: "PASSAGER",
        },
        genre: {
        type: String,
        enum: ["MASCULIN", "FEMININ"],
        default: "MASCULIN",
        },
        statut: {
        type: String,
        enum: ["ACTIF", "INACTIF", "SUSPENDU"],
        default: "ACTIF",
        },
        photoUrl: {
        type: String,
        },
        badges: {
        type: [String],
        default: []
        },
        nombreTrajets: {
        type: Number,
        default: 0
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Utilisateurs", utilisateurSchema);
