const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require ('morgan');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        succes: true,
        message: "API TAKA TAKA opérationnelle",
        horodatage: new Date().toISOString(),
    });
});
//==================== GESTIONS COMPTE =====================
//Gestion Utilisateurs
const authRoutes = require("./routes/compte/authRoutes");
//Montage
app.use("/api/auth", authRoutes);


// ===================== ROUTES ADMIN =====================
const dashboardRoutes = require("./routes/admin/dashboardRoutes");
const passagerRoutes = require("./routes/admin/passagerRoutes");
const chauffeurRoutes = require("./routes/admin/chauffeurRoutes");
const documentRoutes = require("./routes/admin/documentRoutes");
const commissionRoutes = require("./routes/admin/commissionRoutes");
const validationRoutes = require("./routes/admin/validationRoutes");
const trajetRoutes = require("./routes/admin/trajetRoutes");
const paiementRoutes = require("./routes/admin/paiementRoutes");
const rapportRoutes = require("./routes/admin/rapportRoutes");
const litigeRoutes = require("./routes/admin/litigeRoutes");
const profileRoutes = require("./routes/admin/profileRoutes");
//Montage
app.use("/api/admin", dashboardRoutes);
app.use("/api/admin", passagerRoutes);
app.use("/api/admin", chauffeurRoutes);
app.use("/api/admin", documentRoutes);
app.use("/api/admin", commissionRoutes);
app.use("/api/admin", validationRoutes);
app.use("/api/admin", trajetRoutes);
app.use("/api/admin", paiementRoutes);
app.use("/api/admin", rapportRoutes);
app.use("/api/admin", litigeRoutes);
app.use("/api/admin", profileRoutes);

// ===================== ROUTES PASSAGER ET BRANCHEMENT =====================
//Passager - Estimations
const estimationRoutesP = require("./routes/passager/estimationsRoutes");
app.use("/api/estimations", estimationRoutesP);

//Passager - Reservations Immédiates
const reservationImmediateRoutesP = require("./routes/passager/reservationImmediateRoutes");
app.use("/api/reservations-immediate", reservationImmediateRoutesP);

//Passager - Paiements
const paiementRoutesP = require("./routes/passager/paiementsRoutes");
app.use("/api/paiements", paiementRoutesP);

//Passager - Réservations Planifiées
const reservationPlanifieeRoutesP = require("./routes/passager/reservationsPlanifieeRoutes");
app.use("/api/passager/reservations-planifiees", reservationPlanifieeRoutesP);

//Passager - Trajets
const trajetsRoutesP = require("./routes/passager/trajetsRoutes");
app.use("/api/passager", trajetsRoutesP);

//Passager - Historiques des Paiements
const listesPaiements = require("./routes/passager/listesPaimentsRoutes");
app.use("/api/passager/paiements", listesPaiements);

//Stats Passager - Planning
const statsRoutesPlanning = require("./routes/passager/statsRoutesPlanning");
app.use("/api/passager", statsRoutesPlanning);

//Profil
const profileRoutesP = require("./routes/passager/profileRoutes");
app.use("/api/passager/profile", profileRoutesP);

//Changement Mot de Passe
const motDePasseRoutesP = require("./routes/passager/motDePasseRoutes");
app.use("/api/passager", motDePasseRoutesP);

//Notifications
const notificationsRoutesP = require("./routes/passager/notificationsRoutes");
app.use("/api/passager", notificationsRoutesP);




module.exports = app;