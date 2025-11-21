import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  juegoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: [true, 'El ID del juego es obligatorio']
  },
  puntuacion: {
    type: Number,
    required: [true, 'La puntuación es obligatoria'],
    min: [1, 'La puntuación mínima es 1'],
    max: [5, 'La puntuación máxima es 5']
  },
  textoReseña: {
    type: String,
    required: [true, 'El texto de la reseña es obligatorio'],
    trim: true,
    maxlength: [1000, 'La reseña no puede exceder 1000 caracteres']
  },
  horasJugadas: {
    type: Number,
    default: 0,
    min: 0
  },
  dificultad: {
    type: String,
    enum: ['Fácil', 'Normal', 'Difícil'],
    default: 'Normal'
  },
  recomendaria: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true 
})

reviewSchema.index({ juegoId: 1 })

const Review = mongoose.model('Review', reviewSchema)

export default Review