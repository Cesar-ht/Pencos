import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import certificateRoutes from './certificateRoutes.js';

const router = express.Router();

// Ruta para la raíz del API
router.get('/', (req, res) => {
  res.json({
    message: '✅ API funcionando correctamente',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/users', 
      certificate: '/api/certificate'
    },
    documentation: 'Agrega aquí el link a tu documentación si tienes'
  });
});

// Tus rutas existentes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/certificate', certificateRoutes);

export default router;