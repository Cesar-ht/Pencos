import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/database.js';

const PORT = process.env.PORT || 5000;

// Conectar a MongoDB y arrancar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  });
});