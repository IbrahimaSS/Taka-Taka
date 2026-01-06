const jwt = require("jsonwebtoken");
const Utilisateur = require("../models/Utilisateurs");

exports.verifierToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            succes: false,
            message: "Accès refusé. Token manquant",
        });
        }

        const token = authHeader.split(" ")[1];

        let donnees;
        try {
        donnees = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
        return res.status(401).json({
            succes: false,
            message: "Token invalide ou expiré",
        });
        }

        const utilisateur = await Utilisateur.findById(donnees.id).select(
        "-motDePasse"
        );

        if (!utilisateur) {
        return res.status(401).json({
            succes: false,
            message: "Utilisateur introuvable",
        });
        }

        // Injection dans la requête
        req.utilisateur = utilisateur;

        next();
    } catch (error) {
        return res.status(500).json({
        succes: false,
        message: "Erreur serveur (auth)",
        });
    }
};
