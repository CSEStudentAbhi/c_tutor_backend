const express = require("express");
const router = express.Router();
const Feedback = require("../model/Feedback");

router.post("/", async (req, res) => {
    const { name, usn, message } = req.body;

    if (!message || message.length < 3) {
        return res.status(400).json({ error: "Message too short" });
    }

    await Feedback.create({ name, usn, message });

    res.json({ message: "success" });
});

module.exports = router;
