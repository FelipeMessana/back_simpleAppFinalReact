import { connect } from "../databases";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const secreto = process.env.SECRET_KEY;

export const logIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const cnn = await connect();
    const query = "SELECT id, password, role FROM users WHERE username=?";
    const [rows] = await cnn.query(query, [username]);

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no existe" });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = getToken({ id: user.id, role: user.role });
      return res.status(200).json({
        success: true,
        message: "Login exitoso",
        token,
        user: {
          id: user.id,
          role: user.role,
        },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.log("error de login", error.message);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const userExist = async (cnn, tabla, atributo, valor) => {
  try {
    const [row] = await cnn.query(
      `SELECT * FROM ${tabla} WHERE ${atributo}=?`,
      [valor]
    );
    return row.length > 0;
  } catch (error) {
    console.log("userExist", error);
  }
};

export const createUsers = async (req, res) => {
  try {
    const cnn = await connect();
    const { username, email, password } = req.body;

    // Verificar si el username ya existe
    const usernameExist = await userExist(cnn, "users", "username", username);
    // Verificar si el email ya existe
    const emailExist = await userExist(cnn, "users", "email", email);

    if (usernameExist || emailExist) {
      return res.json({
        message: "El usuario o correo ya existe",
        success: false,
      });
    } else {
      // Si no existen duplicados, crear el usuario
      const hashedPassword = await bcrypt.hash(password, 10);
      const query =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      const [result] = await cnn.query(query, [
        username,
        email,
        hashedPassword,
      ]);

      if (result.affectedRows === 1) {
        return res.json({
          message: "Usuario creado exitosamente",
          success: true,
        });
      } else {
        return res.status(500).json({ message: "No se pudo crear el usuario" });
      }
    }
  } catch (error) {
    console.log("create user", error.message);
    return res
      .status(500)
      .json({ message: "Error del servidor", success: false });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const cnn = await connect();
    const query =
      "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)";
    const [result] = await cnn.query(query, [name, description, price, stock]);

    if (result.affectedRows === 1) {
      return res.json({
        message: "Producto agregado exitosamente",
        success: true,
      });
    } else {
      return res
        .status(500)
        .json({ message: "No se pudo agregar el producto" });
    }
  } catch (error) {
    console.log("addProduct", error.message);
    return res
      .status(500)
      .json({ message: "Error del servidor", success: false });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const cnn = await connect();
    const query = "DELETE FROM products WHERE id=?";
    const [result] = await cnn.query(query, [id]);

    if (result.affectedRows === 1) {
      return res.json({
        message: "Producto eliminado exitosamente",
        success: true,
      });
    } else {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.log("deleteProduct", error.message);
    return res
      .status(500)
      .json({ message: "Error del servidor", success: false });
  }
};

const getToken = (payload) => {
  try {
    return jwt.sign(payload, secreto, { expiresIn: "1h" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const auth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, secreto, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

export const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "No autorizado" });
  }
  next();
};
