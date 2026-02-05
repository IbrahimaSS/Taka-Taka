const Utilisateur = require("../../models/Utilisateurs");
const authService = require("../../services/authService");

exports.changerMotDePasse = async (req, res) => {
    try {
        const userId = req.utilisateur._id;
        const { motDePasseActuel, nouveauMotDePasse, confirmation } = req.body;
        if (!motDePasseActuel || !nouveauMotDePasse || !confirmation) {
            return res.status(400).json({
                succes: false,
                message: "Tous les champs sont requis",
            });
        }

        if (nouveauMotDePasse.length < 8) {
            return res.status(400).json({
                succes: false,
                message: "Le mot de passe doit contenir au moins 8 caractères",
            });
        }

        if (nouveauMotDePasse !== confirmation) {
            return res.status(400).json({
                succes: false,
                message: "La confirmation ne correspond pas",
            });
        }

        const utilisateur = await Utilisateur.findById(userId);

        if (!utilisateur) {
            return res.status(404).json({
                succes: false,
                message: "Utilisateur introuvable",
            });
        }

        // Vérification via authService
        const motDePasseValide = await authService.comparePassword(
        motDePasseActuel,
        utilisateur.motDePasse
        );

        if (!motDePasseValide) {
            return res.status(400).json({
                succes: false,
                message: "Mot de passe actuel incorrect",
            });
        }

        // Hash via authService
        const hash = await authService.hashPassword(nouveauMotDePasse);
        utilisateur.motDePasse = hash;
        await utilisateur.save();

        return res.status(200).json({
        succes: true,
        message: "Mot de passe modifié avec succès",
        });
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: error.message,
        });
    }
};
