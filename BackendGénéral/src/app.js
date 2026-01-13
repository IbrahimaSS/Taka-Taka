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
const trajetRoutes = require("./routes/trajetRoutes");
app.use("/api/trajets", trajetRoutes);

//Réservations
const reservationRoutes = require("./routes/reservationRoutes");
app.use("/api/reservations", reservationRoutes);

//Notations
const evaluationRoutes = require("./routes/evaluationRoutes");
app.use("/api/evaluations", evaluationRoutes);

//Litiges
const litigeRoutes = require("./routes/litigeRoutes");
app.use("/api/litiges", litigeRoutes);

//Admin
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);






module.exports = app;