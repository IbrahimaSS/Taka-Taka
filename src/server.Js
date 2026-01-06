require("dotenv").config();
const app = require("./app");
const connecterBaseDeDonnees = require("./config/baseDeDonnees");


const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connecterBaseDeDonnees();

app.listen(PORT, () => {
    console.log(`🚀 Serveur TAKA TAKA démarré sur le port ${PORT}`);
});
