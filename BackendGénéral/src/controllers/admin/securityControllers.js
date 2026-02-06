const bcrypt = require("bcryptjs");
const Utilisateurs = require("../../models/Utilisateurs");

exports.changePassword = async (req, res) => {
    try {
        const {
        motDePasseActuel,
        nouveauMotDePasse,
        confirmationMotDePasse,
        } = req.body;

        // ===== VALIDATIONS =====
        if (!motDePasseActuel || !nouveauMotDePasse || !confirmationMotDePasse) {
        return res.status(400).json({
            succes: false,
            message: "Tous les champs sont requis",
        });
        }

        if (nouveauMotDePasse !== confirmationMotDePasse) {
        return res.status(400).json({
            succes: false,
            message: "Les mots de passe ne correspondent pas",
        });
        }

        if (nouveauMotDePasse.length < 8) {
        return res.status(400).json({
            succes: false,
            message: "Le mot de passe doit contenir au moins 8 caractères",
        });
        }

        // ===== RÉCUPÉRER UTILISATEUR AVEC MOT DE PASSE =====
        const user = await Utilisateurs.findById(req.utilisateur._id).select(
        "+motDePasse"
        );

        if (!user) {
        return res.status(404).json({
            succes: false,
            message: "Utilisateur introuvable",
        });
        }

        // ===== VÉRIFICATION ANCIEN MOT DE PASSE =====
        const isMatch = await bcrypt.compare(motDePasseActuel, user.motDePasse);
        if (!isMatch) {
        return res.status(401).json({
            succes: false,
            message: "Mot de passe actuel incorrect",
        });
        }

        // ===== HASH NOUVEAU MOT DE PASSE =====
        const salt = await bcrypt.genSalt(10);
        user.motDePasse = await bcrypt.hash(nouveauMotDePasse, salt);

        // 🔒 Forcer la déconnexion (invalider anciens tokens)
        user.passwordChangedAt = new Date();

        await user.save();

        // 📧 Ici tu pourras brancher l'envoi d'email de sécurité
        // sendSecurityEmail(user.email)

        return res.json({
        succes: true,
        message:
            "Mot de passe mis à jour avec succès. Veuillez vous reconnecter.",
        forceLogout: true, // utile côté frontend
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        succes: false,
        message: "Erreur changement mot de passe",
        });
    }
};
