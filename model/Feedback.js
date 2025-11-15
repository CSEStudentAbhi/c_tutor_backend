const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    name: String,
    usn: String,
    message: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
