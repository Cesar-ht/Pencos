import express from 'express';
import User from '../models/User.js';
import { proteger } from '../middlewares/authMiddleware.js';
import { soloAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// [ADMIN] Listar todos los usuarios
router.get('/', proteger, soloAdmin, async (req, res) => {
  try {
    const usuarios = await User.find()
      .select('-contraseña')
      .populate('certificado');
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// [ADMIN] Buscar usuario por cédula
router.get('/buscar/:cedula', proteger, soloAdmin, async (req, res) => {
  try {
    const usuario = await User.findOne({ cedula: req.params.cedula })
      .select('-contraseña')
      .populate('certificado');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: 'Error en la búsqueda' });
  }
});

// [ADMIN] Crear usuario (cédula = usuario = contraseña)
router.post('/crear', proteger, soloAdmin, async (req, res) => {
  try {
    const { cedula, nombre, email } = req.body;

    if (!cedula || !nombre) {
      return res.status(400).json({ message: 'Cédula y nombre son requeridos' });
    }

    const existe = await User.findOne({ cedula });
    if (existe) {
      return res.status(400).json({ message: 'Esta cédula ya está registrada' });
    }

    const usuario = await User.create({
      cedula,
      nombre,
      email: email || null,
      contraseña: cedula
    });

    res.status(201).json({
      message: 'Usuario creado correctamente',
      usuario: {
        id: usuario._id,
        cedula: usuario.cedula,
        nombre: usuario.nombre
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
});

// [ADMIN] Eliminar usuario
router.delete('/:id', proteger, soloAdmin, async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

export default router;