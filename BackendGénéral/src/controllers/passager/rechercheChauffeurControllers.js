exports.rechercherChauffeur = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  reservation.statut = "EN_ATTENTE_CHAUFFEUR";
  await reservation.save();

  // ⚡ notifier les chauffeurs proches (via socket)
  io.emit("chauffeur:nouvelle_course", {
    reservationId: reservation._id,
    depart: reservation.depart,
    destination: reservation.destination,
  });

  return res.json({
    succes: true,
    message: "Recherche de chauffeur lancée",
  });
};
