import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generar JWT
const generarToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Registro
export const registro = async (req, res) => {
  try {
    const { cedula, nombre, email } = req.body;

    if (!cedula || !nombre) {
      return res.status(400).json({ 
        message: 'Cédula y nombre son requeridos' 
      });
    }

    const existeUsuario = await User.findOne({ cedula });
    
    if (existeUsuario) {
      return res.status(400).json({ 
        message: 'Esta cédula ya está registrada' 
      });
    }

    const usuario = await User.create({
      cedula,
      nombre,
      email: email || null,
      contraseña: cedula
    });

    const token = generarToken(usuario._id, usuario.rol);

    res.status(201).json({
      token,
      usuario: usuario.cedula,
      nombre: usuario.nombre,
      rol: usuario.rol
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    const user = await User.findOne({ cedula: usuario });

    if (!user) {
      return res.status(401).json({ message: 'Cédula no registrada' });
    }

    const esCorrecta = await user.compararContraseña(contraseña);
    
    if (!esCorrecta) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generarToken(user._id, user.rol);

    res.json({
      token,
      usuario: user.cedula,
      nombre: user.nombre,
      rol: user.rol
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  res.json({ message: 'Sesión cerrada correctamente' });
};

// Obtener usuario actual
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-contraseña')
      .populate('certificado');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};