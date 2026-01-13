const bcrypt = require("bcrypt");
const Utilisateur = require("../models/Utilisateurs");
const jwt = require("jsonwebtoken");

//Inscription
exports.inscrireUtilisateur = async (donnees) => {
    const {
        nom,
        prenom,
        email,
        telephone,
        motDePasse,
        typeProfil,
        genre,
    } = donnees;

    const utilisateurExiste = await Utilisateur.findOne({
        $or: [{ email }, { telephone }],
    });

    if (utilisateurExiste) {
        throw new Error("Un utilisateur avec cet email ou téléphone existe déjà");
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const roleFinal = typeProfil === "CHAUFFEUR" ? "CHAUFFEUR" : "PASSAGER";

    const nouvelUtilisateur = await Utilisateur.create({
        nom,
        prenom,
        email,
        telephone,
        motDePasse: motDePasseHash,
        role: roleFinal,
        genre,
    });

    return nouvelUtilisateur;
    };
    //Verifier
    exports.verifierUtilisateurExiste = async (email, telephone) => {
        const utilisateurExiste = await Utilisateur.findOne({
            $or: [{ email }, { telephone }],
        });

        return !!utilisateurExiste;
    };


    // Connexion
    exports.connecterUtilisateur = async (identifiant, motDePasse) => {
    let utilisateur;

    // Détecter email ou téléphone
    if (identifiant.includes("@")) {
        utilisateur = await Utilisateur.findOne({ email: identifiant });
    } else {
        utilisateur = await Utilisateur.findOne({ telephone: identifiant });
    }

    if (!utilisateur) {
        throw new Error("Identifiant ou mot de passe incorrect");
    }
    if (!motDePasse || motDePasse.length < 8) {
        throw new Error("Le mot de passe doit contenir au moins 8 caractères");
    }

    const motDePasseValide = await bcrypt.compare(
        motDePasse,
        utilisateur.motDePasse
    );

    if (!motDePasseValide) {
        throw new Error("Identifiant ou mot de passe incorrect");
    }

    const token = jwt.sign(
        {
        id: utilisateur._id,
        role: utilisateur.role,
        },
        process.env.JWT_SECRET,
        {
        expiresIn: "7d",
        }
    );

    return {
        token,
        utilisateur,
    };
};
