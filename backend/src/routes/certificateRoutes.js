import express from 'express';
import { 
  subirCertificado, 
  miCertificado, 
  descargarCertificado,
  listarCertificados 
} from '../controllers/certificateController.js';
import proteger from '../middlewares/authMiddleware.js';
import soloAdmin from '../middlewares/adminMiddleware.js';
import uploadPDF from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rutas de usuario
router.get('/me', proteger, miCertificado);
router.get('/download', proteger, descargarCertificado);

// Rutas de admin
router.post('/upload', proteger, soloAdmin, uploadPDF.single('certificado'), subirCertificado);
router.get('/all', proteger, soloAdmin, listarCertificados);

export default router;