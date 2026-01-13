exports.autoriserRoles = (...rolesAutorises) => {
    return (req, res, next) => {
        if (!req.utilisateur) {
        return res.status(401).json({
            succes: false,
            message: "Utilisateur non authentifié",
        });
        }

        if (!rolesAutorises.includes(req.utilisateur.role)) {
        return res.status(403).json({
            succes: false,
            message: "Accès interdit pour ce rôle",
        });
        }

        next();
    };
};
