const mongoose = require("mongoose");
const Utilisateurs = require("../models/Utilisateurs");
const Reservation = require("../models/Reservations");
const Evaluation = require("../models/Evaluations");
const ChauffeurProfile = require("../models/ChauffeurProfile");
const Document = require("../models/Documents");

//================================ DASHBOARD ==============================
exports.dashboard = async (req, res) => {
    try {
        // Total utilisateurs
        const utilisateursTotal = await Utilisateurs.countDocuments();

        // Chauffeurs actifs
        const chauffeursActifs = await Utilisateurs.countDocuments({
        role: "CHAUFFEUR",
        statut: "ACTIF",
        });

        // Nombre TOTAL de trajets effectués
        const trajetsEffectues = await Reservation.countDocuments();
        // (optionnel plus strict)
        // { statut: "TERMINEE" }

        // Revenus totaux (PAYE)
        const revenusAgg = await Reservation.aggregate([
        { $match: { "paiement.statut": "PAYE" } },
        {
            $group: {
            _id: null,
            total: { $sum: "$prix" },
            },
        },
        ]);

        const revenusTotal = revenusAgg?.[0]?.total || 0;

        return res.status(200).json({
        succes: true,
        stats: {
            utilisateursTotal,
            chauffeursActifs,
            trajetsEffectues,
            revenusTotal,
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// 5 TRAJETS RÉCENTS
exports.trajetsRecents = async (req, res) => {
    try {
        const trajets = await Reservation.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("passager", "nom prenom telephone")
        .populate("chauffeur", "nom prenom")
        .select("depart destination statut prix createdAt");

        return res.status(200).json({
        succes: true,
        total: trajets.length,
        trajets,
        });
    } catch (error) {
        return res.status(500).json({ succes: false, message: error.message });
    }
};

//================================= GESTION PASSAGERS =================================

// LISTE DES PASSAGERS (PAGINÉE)
exports.listeUtilisateurs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const filtre = { role: "PASSAGER" };
        const total = await Utilisateurs.countDocuments(filtre);

        const utilisateurs = await Utilisateurs.find(filtre)
        .select("nom prenom email role statut createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const resultat = await Promise.all(
        utilisateurs.map(async (user) => {
            const nombreTrajets = await Reservation.countDocuments({
            passager: user._id,
            });

            const notes = await Evaluation.find({ passager: user._id });
            let noteMoyenne = null;

            if (notes.length > 0) {
            const totalNotes = notes.reduce(
                (sum, n) => sum + n.noteGlobale,
                0
            );
            noteMoyenne = (totalNotes / notes.length).toFixed(1);
            }

            return {
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            statut: user.statut,
            createdAt: user.createdAt,
            nombreTrajets,
            noteMoyenne,
            };
        })
    );

    return res.status(200).json({
      succes: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      utilisateurs: resultat,
    });
  } catch (error) {
    return res.status(500).json({ succes: false, message: error.message });
  }
};

// DETAILS D'UN PASSAGER
exports.detailUtilisateur = async (req, res) => {
    try {
        const { id } = req.params;
        const utilisateur = await Utilisateurs.findById(id)
        .select("nom prenom email role statut createdAt");

        if (!utilisateur) {
        return res.status(404).json({
            succes: false,
            message: "Utilisateur introuvable",
        });
        }

        const nombreTrajets = await Reservation.countDocuments({
        passager: utilisateur._id,
        });

        const evaluations = await Evaluation.find({
        passager: utilisateur._id,
        });

        let noteMoyenne = null;
        if (evaluations.length > 0) {
        const totalNotes = evaluations.reduce(
            (sum, e) => sum + e.noteGlobale,
            0
        );
        noteMoyenne = (totalNotes / evaluations.length).toFixed(1);
        }

        const depenseAgg = await Reservation.aggregate([
        {
            $match: {
            passager: new mongoose.Types.ObjectId(utilisateur._id),
            "paiement.statut": "PAYE",
            },
        },
        {
            $group: {
            _id: null,
            total: { $sum: "$prix" },
            },
        },
        ]);

        const totalDepense = depenseAgg?.[0]?.total || 0;

        return res.status(200).json({
        succes: true,
        utilisateur: {
            _id: utilisateur._id,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            email: utilisateur.email,
            role: utilisateur.role,
            statut: utilisateur.statut,
            createdAt: utilisateur.createdAt,
            nombreTrajets,
            noteMoyenne,
            totalDepense,
        },
        });
    } catch (error) {
        return res.status(500).json({ succes: false, message: error.message });
    }
};

// ACTIVER / DESACTIVER / SUSPENDRE PASSAGER
exports.changerStatutUtilisateur = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;
        const statutsAutorises = ["ACTIF", "INACTIF", "SUSPENDU"];
        if (!statutsAutorises.includes(statut)) {
        return res.status(400).json({
            succes: false,
            message: "Statut invalide",
        });
        }
        const utilisateur = await Utilisateurs.findById(id);
        if (!utilisateur) {
        return res.status(404).json({
            succes: false,
            message: "Utilisateur introuvable",
        });
        }

        utilisateur.statut = statut;
        await utilisateur.save();

        return res.status(200).json({
        succes: true,
        message: "===== STATUT UTILISATEUR MIS À JOUR =====",
        utilisateur: {
            _id: utilisateur._id,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            statut: utilisateur.statut,
        },
        });
    } catch (error) {
        return res.status(500).json({ succes: false, message: error.message });
    }
};

// CARDS PASSAGERS
exports.statsUtilisateurs = async (req, res) => {
    try {
        const utilisateursActifs = await Utilisateurs.countDocuments({
        role: "PASSAGER",
        statut: "ACTIF",
        });

        const debutMois = new Date();
        debutMois.setDate(1);
        debutMois.setHours(0, 0, 0, 0);

        const nouveauxCeMois = await Utilisateurs.countDocuments({
        role: "PASSAGER",
        createdAt: { $gte: debutMois },
        });

        const evaluations = await Evaluation.find({
        passager: { $exists: true },
        });

        let noteMoyenneGlobale = null;
        if (evaluations.length > 0) {
        const total = evaluations.reduce(
            (sum, e) => sum + e.noteGlobale,
            0
        );
        noteMoyenneGlobale = (total / evaluations.length).toFixed(1);
        }

        return res.status(200).json({
        succes: true,
        stats: {
            utilisateursActifs,
            nouveauxCeMois,
            noteMoyenneGlobale,
        },
        });
    } catch (error) {
        return res.status(500).json({ succes: false, message: error.message });
    }
};

//===================================CHAUFFEURS======================================

// CARDS CHAUFFEURS
exports.statsChauffeurs = async (req, res) => {
    try {
        // Date début du jour
        const debutJour = new Date();
        debutJour.setHours(0, 0, 0, 0);

        // Chauffeurs actifs
        const chauffeursActifs = await Utilisateurs.countDocuments({
        role: "CHAUFFEUR",
        statut: "ACTIF",
        });

        // Revenus du jour (PAYE + chauffeur)
        const revenusAgg = await Reservation.aggregate([
        {
            $match: {
            chauffeur: { $ne: null },
            "paiement.statut": "PAYE",
            createdAt: { $gte: debutJour },
            },
        },
        {
            $group: {
            _id: null,
            total: { $sum: "$prix" },
            },
        },
        ]);

        const revenusDuJour = revenusAgg?.[0]?.total || 0;

        // Trajets du jour (avec chauffeur)
        const trajetsDuJour = await Reservation.countDocuments({
        chauffeur: { $ne: null },
        createdAt: { $gte: debutJour },
        });

        // Note moyenne des chauffeurs
        const evaluations = await Evaluation.find({
        chauffeur: { $exists: true },
        });

        let noteMoyenne = null;
        if (evaluations.length > 0) {
        const totalNotes = evaluations.reduce(
            (sum, e) => sum + e.noteGlobale,
            0
        );
        noteMoyenne = (totalNotes / evaluations.length).toFixed(1);
        }

        return res.status(200).json({
        succes: true,
        stats: {
            chauffeursActifs,
            revenusDuJour,
            trajetsDuJour,
            noteMoyenne,
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// LISTES DES CHAUFFEURS
exports.listeChauffeurs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const { statut, disponibilite, typeVehicule } = req.query;

        const profileFilter = {};
        if (statut) profileFilter.statut = statut;
        if (disponibilite) profileFilter.disponibilite = disponibilite;
        if (typeVehicule) profileFilter.typeVehicule = typeVehicule;

        const total = await ChauffeurProfile.countDocuments(profileFilter);

        const chauffeurs = await ChauffeurProfile.find(profileFilter)
        .populate("utilisateur", "nom prenom email telephone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const resultat = (
        await Promise.all(
            chauffeurs.map(async (ch) => {
            if (!ch.utilisateur) return null;

            const nombreTrajets = await Reservation.countDocuments({
                chauffeur: ch.utilisateur._id,
            });

            const evaluations = await Evaluation.find({
                chauffeur: ch.utilisateur._id,
            });

            let noteMoyenne = null;
            if (evaluations.length > 0) {
                const totalNotes = evaluations.reduce(
                (sum, e) => sum + e.noteGlobale,
                0
                );
                noteMoyenne = (totalNotes / evaluations.length).toFixed(1);
            }

            return {
                id: ch._id,
                chauffeur: ch.utilisateur,
                statut: ch.statut,
                disponibilite: ch.disponibilite,
                typeVehicule: ch.typeVehicule,
                marqueVehicule: ch.marqueVehicule,
                plaque: ch.plaque,
                nombreTrajets,
                noteMoyenne,
                gainsTotaux: ch.gainsTotaux || 0,
                createdAt: ch.createdAt,
            };
            })
        )
        ).filter(Boolean);

        return res.status(200).json({
        succes: true,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            from: total === 0 ? 0 : skip + 1,
            to: total === 0 ? 0 : skip + resultat.length,
        },
        chauffeurs: resultat,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// DETAILS D'UN CHAUFFEUR
exports.detailChauffeur = async (req, res) => {
    try {
        const { id } = req.params;

        const chauffeurProfile = await ChauffeurProfile.findById(id)
        .populate("utilisateur", "nom prenom email telephone createdAt");

        if (!chauffeurProfile || !chauffeurProfile.utilisateur) {
        return res.status(404).json({
            succes: false,
            message: "Chauffeur introuvable",
        });
        }

        const userId = chauffeurProfile.utilisateur._id;

        // Nombre de trajets
        const nombreTrajets = await Reservation.countDocuments({
        chauffeur: userId,
        });

        // Note moyenne
        const evaluations = await Evaluation.find({ chauffeur: userId });
        let noteMoyenne = null;

        if (evaluations.length > 0) {
        const totalNotes = evaluations.reduce(
            (sum, e) => sum + e.noteGlobale,
            0
        );
        noteMoyenne = (totalNotes / evaluations.length).toFixed(1);
        }

        // Total gagné (PAYE)
        const gainsAgg = await Reservation.aggregate([
        {
            $match: {
            chauffeur: new mongoose.Types.ObjectId(userId),
            "paiement.statut": "PAYE",
            },
        },
        {
            $group: {
            _id: null,
            total: { $sum: "$prix" },
            },
        },
        ]);

        const totalGagne = gainsAgg?.[0]?.total || 0;

        return res.status(200).json({
        succes: true,
        chauffeur: {
            // ===== INFOS CHAUFFEUR =====
            id: chauffeurProfile._id,
            nom: chauffeurProfile.utilisateur.nom,
            prenom: chauffeurProfile.utilisateur.prenom,
            email: chauffeurProfile.utilisateur.email,
            telephone: chauffeurProfile.utilisateur.telephone,
            inscritLe: chauffeurProfile.utilisateur.createdAt,
            derniereActivite: chauffeurProfile.updatedAt,

            statut: chauffeurProfile.statut,
            disponibilite: chauffeurProfile.disponibilite,
            verifie: chauffeurProfile.statut === "ACTIF",
            typeChauffeur: chauffeurProfile.typeVehicule,

            // ===== VEHICULE =====
            vehicule: {
            type: chauffeurProfile.typeVehicule,
            marque: chauffeurProfile.marqueVehicule,
            plaque: chauffeurProfile.plaque,
            },

            // ===== STATS =====
            stats: {
            noteMoyenne,
            nombreTrajets,
            },

            // ===== DOCUMENTS =====
            documents: {
            permis: !!chauffeurProfile.permisConduire,
            assurance: !!chauffeurProfile.assurance,
            carteGrise: !!chauffeurProfile.carteGrise,
            },

            // ===== REVENUS =====
            revenus: {
            totalGagne,
            },
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// ================= ACTIVER / DESACTIVER / SUSPENDRE CHAUFFEUR =================
exports.changerStatutChauffeur = async (req, res) => {
    try {
        const { id } = req.params; // id = ChauffeurProfile._id
        const { statut } = req.body;

        const statutsAutorises = ["ACTIF", "INACTIF", "SUSPENDU"];
        if (!statutsAutorises.includes(statut)) {
        return res.status(400).json({ succes: false, message: "Statut invalide" });
        }

        const chauffeur = await ChauffeurProfile.findById(id).populate(
        "utilisateur",
        "nom prenom email telephone"
        );

        if (!chauffeur || !chauffeur.utilisateur) {
        return res.status(404).json({ succes: false, message: "Chauffeur introuvable" });
        }

        chauffeur.statut = statut;

        // effet métier : si bloqué, il ne doit plus être EN_LIGNE/OCCUPE
        if (statut !== "ACTIF") {
        chauffeur.disponibilite = "HORS_LIGNE";
        }

        await chauffeur.save();

        return res.status(200).json({
        succes: true,
        message: "===== STATUT CHAUFFEUR MIS À JOUR =====",
        chauffeur: {
            id: chauffeur._id,
            nom: chauffeur.utilisateur.nom,
            prenom: chauffeur.utilisateur.prenom,
            statut: chauffeur.statut,
            disponibilite: chauffeur.disponibilite,
        },
        });
    } catch (error) {
        return res.status(500).json({ succes: false, message: error.message });
    }
};

//================================GESTIONS DES DOCUMENTS============================

// CARDS DOCUMENTS
exports.statsDocuments = async (req, res) => {
    try {
        const aujourdHui = new Date();

        const dans7Jours = new Date();
        dans7Jours.setDate(aujourdHui.getDate() + 7);

        // Documents totaux
        const documentsTotaux = await Document.countDocuments();

        // Documents à vérifier
        const aVerifier = await Document.countDocuments({
        statut: "VERIFIER",
        });

        // Documents expirent bientôt
        const expirentBientot = await Document.countDocuments({
        statut: "VALIDE",
        dateExpiration: {
            $gte: aujourdHui,
            $lte: dans7Jours,
        },
        });

        return res.status(200).json({
        succes: true,
        stats: {
            documentsTotaux,
            aVerifier,
            expirentBientot,
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// LISTE DOCUMENTS
exports.listeDocuments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const total = await Document.countDocuments();

        const documents = await Document.find()
        .populate("chauffeur", "nom prenom email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const resultat = documents.map((doc) => ({
        id: doc._id,
        chauffeur: doc.chauffeur,
        type: doc.type,
        numero: doc.numero,
        statut: doc.statut,
        dateExpiration: doc.dateExpiration,
        fichier: doc.fichier,
        createdAt: doc.createdAt,
        }));

        return res.status(200).json({
        succes: true,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        documents: resultat,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// VALIDER / REFUSER DOCUMENT
exports.changerStatutDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        const statutsAutorises = ["VALIDE", "REFUSE"];

        if (!statutsAutorises.includes(statut)) {
        return res.status(400).json({
            succes: false,
            message: "Statut invalide",
        });
        }

        const document = await Document.findById(id);

        if (!document) {
        return res.status(404).json({
            succes: false,
            message: "Document introuvable",
        });
        }

        document.statut = statut;
        await document.save();

        return res.status(200).json({
        succes: true,
        message: "Statut du document mis à jour",
        document,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// VOIR DOCUMENTS D'UN CHAUFFEUR
exports.voirDocumentsChauffeur = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier chauffeur
        const chauffeur = await Utilisateurs.findById(id).select(
        "nom prenom email telephone"
        );

        if (!chauffeur) {
        return res.status(404).json({
            succes: false,
            message: "Chauffeur introuvable",
        });
        }

        // Tous les documents du chauffeur
        const documents = await Document.find({ chauffeur: id }).sort({
        createdAt: -1,
        });

        return res.status(200).json({
        succes: true,
        chauffeur,
        totalDocuments: documents.length,
        documents: documents.map((doc) => ({
            id: doc._id,
            type: doc.type,
            numero: doc.numero,
            statut: doc.statut,
            dateExpiration: doc.dateExpiration,
            fichier: doc.fichier,
            createdAt: doc.createdAt,
        })),
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

//====================================GESTIONS TRAJETS=============================

// ===================== CARDS TRAJETS (ADMIN) =====================
exports.statsTrajets = async (req, res) => {
    try {
        // Début du jour
        const debutJour = new Date();
        debutJour.setHours(0, 0, 0, 0);

        // Trajets aujourd’hui
        const trajetsAujourdhui = await Reservation.countDocuments({
        createdAt: { $gte: debutJour },
        });

        // Trajets en cours
        const trajetsEnCours = await Reservation.countDocuments({
        statut: "EN_COURS",
        });

        // Trajets annulés
        const trajetsAnnules = await Reservation.countDocuments({
        statut: "ANNULEE",
        });

        // Revenus journaliers (PAYE aujourd’hui)
        const revenusAgg = await Reservation.aggregate([
        {
            $match: {
            "paiement.statut": "PAYE",
            createdAt: { $gte: debutJour },
            },
        },
        {
            $group: {
            _id: null,
            total: { $sum: "$prix" },
            },
        },
        ]);

        const revenusJournaliers = revenusAgg?.[0]?.total || 0;

        return res.status(200).json({
        succes: true,
        stats: {
            trajetsAujourdhui,
            trajetsEnCours,
            trajetsAnnules,
            revenusJournaliers,
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// ===================== TOUS LES TRAJETS (ADMIN + PAGINATION) =====================
exports.tousLesTrajets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Total trajets
        const total = await Reservation.countDocuments();

        // Trajets paginés
        const trajets = await Reservation.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("passager", "nom prenom telephone")
        .populate("chauffeur", "nom prenom")
        .select("depart destination statut prix createdAt");

        return res.status(200).json({
        succes: true,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            from: total === 0 ? 0 : skip + 1,
            to: skip + trajets.length,
        },
        trajets,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// ======================RECHERCHER UN TRAJET=============================
exports.trajetsCarte = async (req, res) => {
    try {
        const { depart, destination } = req.query;

        const filter = {
            statut: { $in: ["EN_COURS", "EN_ATTENTE", "ACCEPTEE"] },
        };

        if (depart) {
        filter.depart = { $regex: depart, $options: "i" };
        }

        if (destination) {
        filter.destination = { $regex: destination, $options: "i" };
        }

        const trajets = await Reservation.find(filter).select(
        "_id depart destination latitudeDepart longitudeDepart latitudeArrivee longitudeArrivee"
        );

        return res.status(200).json({
        succes: true,
        trajets,
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};

// ===================== DETAIL D'UN TRAJET (ADMIN) =====================
exports.detailTrajet = async (req, res) => {
    try {
        const { id } = req.params;

        const trajet = await Reservation.findById(id)
        .populate("passager", "nom prenom email telephone")
        .populate("chauffeur", "nom prenom telephone");

        if (!trajet) {
        return res.status(404).json({
            succes: false,
            message: "Trajet introuvable",
        });
        }

        // 🔹 Profil chauffeur (véhicule)
        let vehicule = null;
        if (trajet.chauffeur) {
        const profil = await ChauffeurProfile.findOne({
            utilisateur: trajet.chauffeur._id,
        });

        if (profil) {
            vehicule = {
            modele: profil.marqueVehicule,
            plaque: profil.plaque,
            couleur: profil.couleur,
            annee: profil.annee,
            capacite: profil.capacite,
            carburant: profil.carburant,
            };
        }
        }

        // NOTE DU CHAUFFEUR POUR CE TRAJET
        const evaluation = await Evaluation.findOne({
        reservation: trajet._id,
        });

        const noteChauffeur = evaluation
        ? {
            noteGlobale: evaluation.noteGlobale,
            details: evaluation.details,
            ressenti: evaluation.ressenti,
            pointsForts: evaluation.pointsForts,
            commentaire: evaluation.commentaire,
            }
        : null;

        // Finances
        const totalPassager = trajet.prix || 0;
        const commission = Math.round(totalPassager * 0.15);
        const fraisPlateforme = Math.round(totalPassager * 0.05);
        const gainChauffeur = totalPassager - commission - fraisPlateforme;

        return res.status(200).json({
        succes: true,
        trajet: {
            reference: trajet.reference || `TR-${trajet._id.toString().slice(-6)}`,
            statut: trajet.statut,
            paiement: trajet.paiement?.mode || "ESPECES",
            date: trajet.createdAt,

            depart: trajet.depart,
            destination: trajet.destination,

            distanceKm: trajet.distanceKm,
            dureeMin: trajet.dureeMin,

            passager: trajet.passager,
            chauffeur: trajet.chauffeur,
            vehicule,
            noteChauffeur,

            finances: {
            totalPassager,
            commission,
            fraisPlateforme,
            gainChauffeur,
            },
        },
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};


















