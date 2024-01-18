const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.post("/verifyUser", async (req, res) => {
  const { nickname } = req.body;
  try {
    const existingUser = await User.findOne({ name: nickname });
    if (existingUser) {
      res.status(200).json({ isUser: true, user: null });
    } else {
      const newUser = { name: nickname };
      const savedUser = await User.create(newUser);
      res.status(200).json({ isUser: false, user: savedUser });
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ isUser: false, user: null });
  }
});

module.exports = router;
