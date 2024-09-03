// productController.js
const Product = require("../models/product");

exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    await product.remove();
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
