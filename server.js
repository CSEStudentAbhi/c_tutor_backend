const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const authRoutes = require("./router/auth");
app.use("/auth", authRoutes);
const feedbackRoutes = require("./router/feedback");
app.use("/feedback", feedbackRoutes);
// Connect MongoDB

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running on port " + port));

app.get("/", (req, res) => {
    res.send("CTutor Backend is running");
});