import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombreArchivo: {
    type: String,
    required: true
  },
  // El PDF se guarda aquí como Buffer (binario)
  archivoPDF: {
    type: Buffer,
    required: true
  },
  tipoArchivo: {
    type: String,
    default: 'application/pdf'
  },
  fechaEmision: {
    type: Date,
    required: true
  },
  fechaVencimiento: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['vigente', 'vencido', 'revocado'],
    default: 'vigente'
  },
  subidoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

certificateSchema.methods.verificarVigencia = function() {
  if (new Date() > this.fechaVencimiento) {
    this.estado = 'vencido';
  }
  return this.estado;
};

export default mongoose.model('Certificate', certificateSchema);