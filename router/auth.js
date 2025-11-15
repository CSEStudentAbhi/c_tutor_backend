const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    const { name, usn, branch, email, password } = req.body;
    console.log("REQ BODY:", req.body);

    // Validate fields
    if (!name || !usn || !branch || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Email domain check
    if (!email.endsWith("@rvei.edu.in")) {
        return res.status(400).json({ error: "Only @rvei.edu.in emails allowed" });
    }

    // Check if user already exists
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        usn,
        branch,
        email,
        password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "Registration successful!" });
});



// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email.endsWith("@rvei.edu.in")) {
        return res.status(400).json({ error: "Only @rvei.edu.in emails allowed" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    // JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // ⭐ SEND NAME, BRANCH, USN AS WELL
    res.json({
        message: "Login success",
        token,
        name: user.name,
        usn: user.usn,
        branch: user.branch
    });
});

// reset Password
router.post("/resetpassword", async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email.endsWith("@rvei.edu.in")) {
        return res.status(400).json({ error: "Only @rvei.edu.in emails allowed" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    res.json({ message: "success" });
});

module.exports = router;
