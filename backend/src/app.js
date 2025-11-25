import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://cesar-ht.github.io/Pencos/',
    'https://cesar-ht.github.io'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta para la raíz principal
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Servidor funcionando correctamente',
    api: 'Visita /api para ver los endpoints disponibles',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Rutas API
app.use('/api', routes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal', error: err.message });
});

export default app;