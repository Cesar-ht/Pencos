import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No autorizado. Token no proporcionado.' 
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId  
    };

    next();

  } catch (error) {
    console.error('Error en authMiddleware:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }

    return res.status(500).json({ error: 'Error de autenticación' });
  }
};

export default authMiddleware;