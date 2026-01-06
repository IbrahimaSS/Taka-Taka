const Support = require("../models/Supports");
const Notification = require("../models/Notifications");

// CREATION D'UNE DEMANDE DE SUPPORT
exports.creerTicket = async (req, res) => {
    try {
        const { sujet, message } = req.body;

        if (!sujet || !message) {
        return res.status(400).json({
            succes: false,
            message: "Sujet et message obligatoires",
        });
        }
        //Création du Message
        const ticket = await Support.create({
        utilisateur: req.utilisateur._id,
        nom: req.utilisateur.nom,
        prenom: req.utilisateur.prenom,
        sujet,
        message,
        });

        return res.status(201).json({
        succes: true,
        message: "=====DEMANDE ENVOYEE AU SUPPORT=====",
        ticket,
        });
    } catch (erreur) {
        return res.status(500).json({
        succes: false,
        message: "Erreur lors de l'envoi au support",
        });
    }
};

// LISTES DES TICKETS
exports.mesTickets = async (req, res) => {
    try {
        const tickets = await Support.find({
        utilisateur: req.utilisateur._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
        message: "=====LISTES DES TICKETS=====",
        succes: true,
        tickets,
        });
    } catch (erreur) {
        return res.status(500).json({
        succes: false,
        message: "Erreur lors de la récupération des tickets",
        });
    }
};


// CHANGER LE STATUT D'UN TICKET (ADMIN / SUPPORT)
exports.changerStatut = async (req, res) => {
    try {
        const { statut } = req.body;
        const ticketId = req.params.id;

        if (!["OUVERT", "EN_COURS", "FERME"].includes(statut)) {
        return res.status(400).json({
            succes: false,
            message: "Statut invalide",
        });
        }

        const ticket = await Support.findById(ticketId);
        if (!ticket) {
        return res.status(404).json({
            succes: false,
            message: "Ticket introuvable",
        });
        }

        ticket.statut = statut;
        await ticket.save();
        //Notification
        await Notification.create({
        utilisateur: ticket.utilisateur,
        message: `Le statut de votre ticket "${ticket.sujet}" est maintenant : ${statut}`,
        });

        return res.status(200).json({
        succes: true,
        message: "Statut du ticket mis à jour",
        ticket,
        });
    } catch (erreur) {
        return res.status(500).json({
        succes: false,
        message: "Erreur lors du changement de statut",
        });
    }
};


