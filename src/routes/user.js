const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/user");

const router = express.Router();

// Actualizar información del usuario
router.put("/update", authMiddleware, async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findById(req.user.id);

  if (username) user.username = username;
  if (password) user.password = password; // El pre-save middleware se encargará de cifrarla

  await user.save();
  res.status(200).json({ message: "User information updated successfully" });
});

module.exports = router;
