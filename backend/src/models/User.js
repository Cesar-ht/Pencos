import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  cedula: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contraseña: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  certificado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('contraseña')) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 12);
  next();
});

// Método para comparar contraseñas
userSchema.methods.compararContraseña = async function(contraseñaIngresada) {
  return await bcrypt.compare(contraseñaIngresada, this.contraseña);
};

export default mongoose.model('User', userSchema);