require("dotenv").config();

const http = require("http");
const app = require("./app");
const connecterBaseDeDonnees = require("./config/baseDeDonnees");

const { Server } = require("socket.io");
const initSocket = require("./socket");

const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connecterBaseDeDonnees();

// Création du serveur HTTP
const server = http.createServer(app);

// Initialisation de Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // en prod : mets l’URL du frontend
        methods: ["GET", "POST"],
    },
});

// Initialisation des events socket
initSocket(io);

// Rendre io accessible dans les controllers
app.set("io", io);

// Lancement du serveur
server.listen(PORT, () => {
    console.log(`🚀 Serveur TAKA TAKA + Socket.IO démarré sur le port ${PORT}`);
});
