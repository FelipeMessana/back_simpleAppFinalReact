// product.js
const express = require("express");
const router = express.Router();
const {
  addProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.post("/add", protect, admin, addProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
