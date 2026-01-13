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

//Gestion Utilisateurs
const authRoutes = require("./routes/authRoutes");
const utilisateurRoutes = require("./routes/utilisateurRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/utilisateurs", utilisateurRoutes);

//Contacter Support
const supportRoutes = require("./routes/supportRoutes");
app.use("/api/support", supportRoutes);

//Notification
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

//Gestion Trajets
const trajetRoutesP = require("./routes/trajetRoutes");
app.use("/api/trajets", trajetRoutesP);

//Réservations
const reservationRoutes = require("./routes/reservationRoutes");
app.use("/api/reservations", reservationRoutes);

//Notations
const evaluationRoutes = require("./routes/evaluationRoutes");
app.use("/api/evaluations", evaluationRoutes);

//Litiges
const litigeRoutesP = require("./routes/litigeRoutes");
app.use("/api/litiges", litigeRoutesP);

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







module.exports = app;