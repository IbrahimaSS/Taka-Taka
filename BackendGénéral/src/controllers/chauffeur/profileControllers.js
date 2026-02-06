const ChauffeurProfile = require("../../models/ChauffeurProfile");
const Document = require("../../models/Documents");
const Utilisateurs = require("../../models/Utilisateurs");

const mapTypeVehicule = (type) => {
  const v = String(type || "").toLowerCase();
  if (v === "moto") return "MOTO";
  if (v === "taxi" || v === "taxi_partage" || v === "taxi partagé") return "TAXI_PARTAGE";
  if (v === "voiture" || v === "voiture_privee" || v === "voiture privé" || v === "voiture privée") {
    return "VOITURE";
  }
  return "TAXI_PARTAGE";
};

const ensureProfile = async (userId, typeVehicule) => {
  let profile = await ChauffeurProfile.findOne({ utilisateur: userId });
  if (!profile) {
    profile = await ChauffeurProfile.create({
      utilisateur: userId,
      typeVehicule: typeVehicule || "TAXI_PARTAGE",
    });
  }
  return profile;
};

exports.updateVehicule = async (req, res) => {
  try {
    const { typeVehicule, marque, modele, plaque, couleur, capacite, annee } = req.body || {};

    if (!marque || !plaque) {
      return res.status(400).json({
        succes: false,
        message: "Marque et plaque sont obligatoires",
      });
    }

    const typeFinal = mapTypeVehicule(typeVehicule);
    const profile = await ensureProfile(req.utilisateur._id, typeFinal);

    profile.typeVehicule = typeFinal;
    profile.marqueVehicule = marque;
    profile.modeleVehicule = modele || profile.modeleVehicule;
    profile.plaque = plaque;
    profile.couleurVehicule = couleur || profile.couleurVehicule;
    if (capacite !== undefined && capacite !== null) {
      profile.capaciteVehicule = Number(capacite);
    }
    if (annee !== undefined && annee !== null) {
      profile.anneeVehicule = Number(annee);
    }

    await profile.save();

    await Utilisateurs.findByIdAndUpdate(req.utilisateur._id, {
      vehicule: {
        type: typeFinal === "TAXI_PARTAGE" ? "TAXI" : typeFinal,
        places: profile.capaciteVehicule || 1,
      },
    });

    return res.json({
      succes: true,
      message: "Informations véhicule mises à jour",
      profil: profile,
    });
  } catch (error) {
    return res.status(500).json({ succes: false, message: error.message });
  }
};

exports.uploadDocuments = async (req, res) => {
  try {
    const files = req.files || {};
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const toUrl = (file) => `${baseUrl}/uploads/${file.filename}`;

    const profile = await ensureProfile(req.utilisateur._id);

    const docsToCreate = [];

    if (files.photo?.[0]) {
      const url = toUrl(files.photo[0]);
      profile.photoVehicule = url;
      docsToCreate.push({ type: "PHOTO_VEHICULE", fichier: url });
    }
    if (files.license?.[0]) {
      const url = toUrl(files.license[0]);
      profile.permisConduire = url;
      docsToCreate.push({ type: "PERMIS", fichier: url });
    }
    if (files.idCard?.[0]) {
      const url = toUrl(files.idCard[0]);
      profile.pieceIdentite = url;
      docsToCreate.push({ type: "IDENTITE", fichier: url });
    }
    if (files.carRegistration?.[0]) {
      const url = toUrl(files.carRegistration[0]);
      profile.carteGrise = url;
      docsToCreate.push({ type: "CARTE_GRISE", fichier: url });
    }
    if (files.insurance?.[0]) {
      const url = toUrl(files.insurance[0]);
      profile.assurance = url;
      docsToCreate.push({ type: "ASSURANCE", fichier: url });
    }

    await profile.save();

    if (docsToCreate.length > 0) {
      await Promise.all(
        docsToCreate.map((doc) =>
          Document.findOneAndUpdate(
            { chauffeur: profile._id, type: doc.type },
            { fichier: doc.fichier, statut: "VERIFIER" },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          )
        )
      );
    }

    return res.json({
      succes: true,
      message: "Documents enregistrés",
      profil: profile,
    });
  } catch (error) {
    return res.status(500).json({ succes: false, message: error.message });
  }
};
