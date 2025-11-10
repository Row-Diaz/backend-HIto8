// Importaciones necesarias para el controlador de autenticación
import "dotenv/config";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { authModel } from "../models/auth.model.js";
import { isValidEmail } from "../utils/validators/email.validate.js";

// Controlador para el login de usuarios
const login = async (req, res) => {
  try {
    // Extracción de email y password del cuerpo de la petición
    const { email = "", password = "" } = req.body;

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Búsqueda del usuario en la base de datos
    const user = await authModel.getUserByEmail(email);

    // Verificación de existencia del usuario
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Verificación de contraseña
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generación del token JWT con los datos del usuario
    const payload = { email, id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // Respuesta exitosa con email y token
    return res.json({ email, token });
  } catch (error) {
    // Manejo de errores del servidor
    // console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Controlador para el registro de nuevos usuarios
const register = async (req, res) => {
  try {
    // Extracción de email y password del cuerpo de la petición
    const { email = "", password = "" } = req.body;

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Verificación de que el usuario no exista previamente
    const user = await authModel.getUserByEmail(email);
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    // Creación del nuevo usuario con ID único
    const newUser = { email, password, id: nanoid() };
    await authModel.addUser(newUser);

    // Generación automática del token JWT para login inmediato
    const payload = { email, id: newUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // Respuesta exitosa con email y token
    return res.json({ email, token });
  } catch (error) {
    // Manejo de errores del servidor
    // console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Controlador para obtener información del usuario autenticado
const me = async (req, res) => {
  try {
    // Extracción del email del usuario desde el token decodificado (middleware)
    const { email } = req.user;
    
    // Búsqueda de los datos completos del usuario
    const user = await authModel.getUserByEmail(email);
    
    // Respuesta con información del usuario
    return res.json({ email, id: user.id });
  } catch (error) {
    // Manejo de errores del servidor
    // console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Exportación del objeto controlador con todos los métodos
export const authController = {
  login,    // Método de autenticación
  register, // Método de registro
  me,       // Método de perfil de usuario
};
