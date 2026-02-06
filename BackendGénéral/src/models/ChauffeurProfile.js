const mongoose = require("mongoose");

const chauffeurProfileSchema = new mongoose.Schema(
    {
        utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utilisateurs",
        required: true,
        unique: true,
        },

        // Statut ADMIN
        statut: {
        type: String,
        enum: ["EN_ATTENTE", "ACTIF", "INACTIF", "SUSPENDU"],
        default: "EN_ATTENTE",
        },

        // Disponibilité métier
        disponibilite: {
        type: String,
        enum: ["EN_LIGNE", "HORS_LIGNE", "OCCUPE"],
        default: "HORS_LIGNE",
        },

        // Véhicule
        typeVehicule: {
        type: String,
        enum: ["MOTO", "VOITURE", "TAXI_PARTAGE"],
        required: true,
        },

        marqueVehicule: String,
        modeleVehicule: String,
        plaque: String,
        couleurVehicule: String,
        anneeVehicule: Number,
        capaciteVehicule: Number,

        // Documents
        permisConduire: String,
        carteGrise: String,
        assurance: String,
        photoVehicule: String,
        pieceIdentite: String,

        // Statistiques
        nombreTrajets: {
        type: Number,
        default: 0,
        },

        noteMoyenne: {
        type: Number,
        default: 0,
        },

        dateValidation: Date,

        // Statut ADMIN
        statut: {
        type: String,
        enum: ["EN_ATTENTE", "ACTIF", "INACTIF", "SUSPENDU"],
        default: "EN_ATTENTE",
        },

        validePar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utilisateurs",
        default: null,
        },

        motifRefus: {
        type: String,
        default: null,
        },
        commentaireValidation: {
        type: String,
        default: null
        },
        validePar:
        { type: mongoose.Schema.Types.ObjectId,
        ref: "Utilisateurs",
        default: null
        },
        valideLe:
        { type: Date,
        default: null
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ChauffeurProfile", chauffeurProfileSchema);
