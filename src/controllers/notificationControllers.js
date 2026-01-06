const Notification = require("../models/Notifications");

exports.mesNotifications = async (req, res) => {
    const notifications = await Notification.find({
        utilisateur: req.utilisateur._id,
    }).sort({ createdAt: -1 });

    res.json({
        succes: true,
        notifications,
    });
};
