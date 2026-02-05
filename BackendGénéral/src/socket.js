const Paiement = require("./models/Paiements");
const Evaluation = require("./models/Evaluations");
const Utilisateurs = require("./models/Utilisateurs");
const Reservation = require("./models/Reservations");
const {
  trouverChauffeursEligibles,
} = require("./services/attributionChauffeur.service");

//* ÉTATS MÉMOIRE (SOCKET)

const coursesPrises = new Set();
const courseAssignee = new Map();
const courseEtat = new Map();
const paiementEtat = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connecté :", socket.id);

    //* CONNEXION CLIENT / CHAUFFEUR
  
    socket.on("client:online", ({ role, userId }) => {
      if (!role || !userId) return;

      socket.join(`${role}_${userId}`);

      socket.emit("client:online:ok", {
        message: "Connecté",
        room: `${role}_${userId}`,
      });
    });

    //* ÉTAPE 1 : RECHERCHE CHAUFFEUR
    socket.on("course:rechercher", async (data) => {
      try {
        const {
          reservationId,
          departLat,
          departLng,
          typeVehicule,
          nombrePlaces,
        } = data;

        console.log("🔍 Recherche chauffeur :", reservationId);

        const chauffeurs = await trouverChauffeursEligibles({
          departLat,
          departLng,
          typeVehicule,
          nombrePlaces,
        });

        if (!chauffeurs.length) {
          socket.emit("course:aucun_chauffeur", {
            message: "Aucun chauffeur disponible",
          });
          return;
        }

        // Envoi ciblé uniquement aux chauffeurs éligibles
        chauffeurs.forEach((c) => {
          io.to(c.socketId).emit("course:demande", {
            reservationId,
            distance: c.distance,
          });
        });

        socket.emit("course:recherche_envoyee", {
          nombreChauffeurs: chauffeurs.length,
        });
      } catch (error) {
        console.error(error);
        socket.emit("course:erreur", {
          message: "Erreur recherche chauffeur",
        });
      }
    });

    //* ÉTAPE 2 : ACCEPTATION COURSE
    socket.on("course:accepter", async ({ reservationId }) => {
      if (coursesPrises.has(reservationId)) {
        socket.emit("course:deja_prise", {
          message: "Course déjà prise",
        });
        return;
      }

      coursesPrises.add(reservationId);
      courseAssignee.set(reservationId, socket.id);
      courseEtat.set(reservationId, "VERS_PASSAGER");

      await Reservation.findByIdAndUpdate(reservationId, {
        statut: "ACCEPTEE",
      });

      io.emit("course:chauffeur_assigne", {
        reservationId,
        chauffeurSocketId: socket.id,
      });

      console.log("✅ Course acceptée :", reservationId);
    });

    //* ÉTAPE 3 : DÉMARRER TRAJET
    socket.on("course:demarrer", async ({ reservationId }) => {
      if (courseAssignee.get(reservationId) !== socket.id) {
        socket.emit("course:demarrage_refuse", {
          message: "Non autorisé",
        });
        return;
      }

      courseEtat.set(reservationId, "EN_COURS");

      await Reservation.findByIdAndUpdate(reservationId, {
        statut: "EN_COURS",
        dateDebut: new Date(),
      });

      io.emit("course:en_cours", { reservationId });
    });

    //* ÉTAPE 4 : GPS TEMPS RÉEL
    socket.on("chauffeur:position", ({ reservationId, lat, lng }) => {
      if (courseAssignee.get(reservationId) !== socket.id) return;

      io.emit("chauffeur:position_update", {
        reservationId,
        lat,
        lng,
        etat: courseEtat.get(reservationId),
      });
    });

    //* ÉTAPE 5 : FIN DU TRAJET
    socket.on("course:terminer", async ({ reservationId }) => {
      if (courseAssignee.get(reservationId) !== socket.id) return;

      paiementEtat.set(reservationId, "EN_ATTENTE");
      courseEtat.delete(reservationId);

      await Reservation.findByIdAndUpdate(reservationId, {
        statut: "TERMINEE",
        dateFin: new Date(),
      });

      io.emit("course:termine", { reservationId });
    });

    //* ÉTAPE 6 : PAIEMENT
    socket.on("paiement:confirmer", async ({ reservationId, methode }) => {
      try {
        if (paiementEtat.get(reservationId) !== "EN_ATTENTE") {
          socket.emit("paiement:refuse", {
            message: "Paiement invalide",
          });
          return;
        }

        const reservation = await Reservation.findById(reservationId)
          .populate("passager")
          .populate("chauffeur");

        const montantTotal = reservation.prix;
        const commissionPlateforme = montantTotal * 0.15;
        const montantChauffeur = montantTotal - commissionPlateforme;

        await Paiement.create({
          reservation: reservation._id,
          passager: reservation.passager._id,
          chauffeur: reservation.chauffeur._id,
          montantTotal,
          commissionPlateforme,
          montantChauffeur,
          methode,
          statut: "PAYE",
        });

        paiementEtat.set(reservationId, "PAYE");

        io.emit("paiement:confirme", {
          reservationId,
          methode,
        });
      } catch (error) {
        console.error(error);
        socket.emit("paiement:refuse", {
          message: "Erreur paiement",
        });
      }
    });

    //* ÉTAPE 7 : ÉVALUATION
    socket.on("evaluation:envoyer", async (data) => {
      try {
        if (paiementEtat.get(data.reservationId) !== "PAYE") {
          socket.emit("evaluation:refusee", {
            message: "Paiement requis",
          });
          return;
        }

        const reservation = await Reservation.findById(data.reservationId)
          .populate("chauffeur")
          .populate("passager");

        await Evaluation.create({
          reservation: reservation._id,
          passager: reservation.passager._id,
          chauffeur: reservation.chauffeur._id,
          ...data,
        });

        const chauffeur = await Utilisateurs.findById(
          reservation.chauffeur._id
        );

        chauffeur.noteMoyenne =
          (chauffeur.noteMoyenne * chauffeur.nombreEvaluations +
            data.noteGlobale) /
          (chauffeur.nombreEvaluations + 1);

        chauffeur.nombreEvaluations += 1;
        await chauffeur.save();

        io.emit("evaluation:confirmee", {
          reservationId: data.reservationId,
          noteGlobale: data.noteGlobale,
        });
      } catch (error) {
        console.error(error);
        socket.emit("evaluation:refusee", {
          message: "Erreur évaluation",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket déconnecté :", socket.id);
    });
  });
};
