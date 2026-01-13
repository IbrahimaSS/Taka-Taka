const mongoose = require("mongoose");

const trajetSchema = new mongoose.Schema(
    {
        depart: {
        type: String,
        required: true,
        trim: true,
        },
        destination: {
        type: String,
        required: true,
        trim: true,
        },
        distanceKm: {
        type: Number,
        required: true,
        min: 0,
        },
        dureeMin: {
        type: Number,
        required: true,
        min: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Trajet", trajetSchema);
