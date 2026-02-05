const Reservation = require("../../models/Reservations");

exports.confirmerReservationImmediate = async (req, res) => {
    try {
        const {
        depart,
        destination,
        distanceKm,
        dureeMin,
        typeVehicule,
        prix,
        momentPaiement // "MAINTENANT" | "FIN"
        } = req.body;

        const reservation = await Reservation.create({
        passager: req.utilisateur._id,
        depart,
        destination,
        distanceKm,
        dureeMin,
        typeVehicule,
        prix,
        typeCourse: "IMMEDIATE",
        statut: "EN_ATTENTE",
        paiement:
            momentPaiement === "MAINTENANT"
            ? { statut: "EN_ATTENTE" }
            : null,
        });

        res.status(201).json({
        succes: true,
        message: "Recherche de chauffeur lancée",
        reservation,
        });
    } catch (e) {
        res.status(500).json({ succes: false, message: e.message });
    }
};
