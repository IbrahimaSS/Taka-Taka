const Utilisateur = require("../models/Utilisateurs");
const {validationResult} = require("express-validator");

//AFFICHER LE PROFIL
exports.getProfil = async (req, res) => {
    try {
        return res.status(200).json({
        succes: true,
        message: "=====INFORMATIONS UTILISATEURS=====",
        utilisateur: req.utilisateur,
        });
    } catch (erreur) {
        return res.status(500).json({
        succes: false,
        message: "Erreur lors de la récupération du profil",
        });
    }
    };

//MODIFIER LE PROFIL
    exports.updateProfil = async (req, res) => {
    try {
        const erreurs = validationResult(req);
        if (!erreurs.isEmpty()) {
        return res.status(400).json({
            succes: false,
            erreurs: erreurs.array(),
        });
        }

        const userId = req.utilisateur._id;

        const champsAutorises = ["nom", "prenom", "email", "telephone", "genre"];
        const donnees = {};

        champsAutorises.forEach((champ) => {
        if (req.body[champ] !== undefined) {
            donnees[champ] = req.body[champ];
        }
        });

        // Vérification unicité email / téléphone
        if (donnees.email || donnees.telephone) {
        const utilisateurExiste = await Utilisateur.findOne({
            _id: { $ne: userId },
            $or: [
            donnees.email ? { email: donnees.email } : null,
            donnees.telephone ? { telephone: donnees.telephone } : null,
            ].filter(Boolean),
        });

        if (utilisateurExiste) {
            return res.status(400).json({
            succes: false,
            message: "Email ou numéro de téléphone déjà utilisé",
            });
        }
        }

        const utilisateurMisAJour = await Utilisateur.findByIdAndUpdate(
        userId,
        donnees,
        { new: true, runValidators: true }
        ).select("-motDePasse");

        return res.status(200).json({
        succes: true,
        message: "=====PROFIL MISE A JOUR AVEC SUCCES=====",
        utilisateur: utilisateurMisAJour,
        });
    } catch (erreur) {
        return res.status(400).json({
        succes: false,
        message: erreur.message,
        });
    }
};

