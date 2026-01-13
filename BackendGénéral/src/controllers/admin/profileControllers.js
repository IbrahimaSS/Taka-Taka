const Utilisateurs = require("../../models/Utilisateurs");

// VOIR MON PROFILE
exports.getProfile = async (req, res) => {
    try {
        const user = req.utilisateur;

        return res.json({
        succes: true,
        profile: {
            message:"=====Profile Admin=====",
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            telephone: user.telephone,
            localisation: user.localisation,
            role: user.role,
            createdAt: user.createdAt,
        },
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: "Erreur chargement profil" });
    }
};

// MODIFIER LE PROFIL
exports.updateProfile = async (req, res) => {
    try {
        const { nom, prenom, telephone, email } = req.body || {};
        const user = req.utilisateur;
        // ===== Vérification EMAIL =====
        if (email && email !== user.email) {
        const emailExiste = await Utilisateurs.findOne({
            email,
            _id: { $ne: user._id }
        });
        if (emailExiste) {
            return res.status(400).json({
            succes: false,
            message: "Cette adresse email est déjà utilisée"
            });
        }
        user.email = email;
        }
        // ===== Vérification TELEPHONE =====
        if (telephone && telephone !== user.telephone) {
        const telExiste = await Utilisateurs.findOne({
            telephone,
            _id: { $ne: user._id }
        });
        if (telExiste) {
            return res.status(400).json({
            succes: false,
            message: "Ce numéro de téléphone est déjà utilisé"
            });
        }
        user.telephone = telephone;
        }
        // ===== Autres champs =====
        if (nom) user.nom = nom;
        if (prenom) user.prenom = prenom;

        await user.save();

        return res.json({
        succes: true,
        message: "Profil mis à jour",
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
        succes: false,
        message: "Erreur mise à jour profil"
        });
    }
};

// JOURNAL DES ACTIVITE
exports.journalActivite = async (req, res) => {
    try {
        const logs = await Journal.find({ utilisateur: req.utilisateur._id })
        .sort({ createdAt: -1 })
        .limit(10);
        res.json({
        succes: true,
        activites: logs,
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: "Erreur journal activité" });
    }
};

// STATISTIQUES RAPIDES
exports.statsProfile = async (req, res) => {
    try {
        return res.json({
        succes: true,
        stats: {
            actionsAujourdhui: 24,
            validationsEnAttente: 12,
            notifications: 8,
        },
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: "Erreur stats profil" });
    }
    };



