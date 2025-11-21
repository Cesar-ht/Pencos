import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';

// Routes
import authRoutes from './src/routes/auth.js';
import gameRoutes from './src/routes/gameRoutes.js';
import reviewRoutes from './src//routes/reviewRoutes.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => {
  console.error('Error conectando a MongoDB Atlas:', err);
  process.exit(1);
});

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado a la base de datos');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/reviews', reviewRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🚀 GameTracker API funcionando!',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
    timestamp: new Date().toISOString()
  });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🎮 GameTracker API ejecutándose en http://localhost:${PORT}`);
});