const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Importa CORS
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// Middleware para analizar cuerpos JSON
app.use(express.json());

// Middleware para habilitar CORS
app.use(cors()); // Agrega esta línea

// Conexión a la Base de Datos
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log(err));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Crear usuario administrador inicial si no existe
const User = require("./models/user");
const bcrypt = require("bcryptjs");

async function createInitialAdmin() {
  try {
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("adminpassword", 10); // Cambia 'adminpassword' a una contraseña segura
      admin = new User({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("Usuario admin creado");
    }
  } catch (error) {
    console.error("Error al crear el usuario admin inicial:", error);
  }
}

createInitialAdmin();
