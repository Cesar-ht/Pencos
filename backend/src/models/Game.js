import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  genero: {
    type: String,
    required: [true, 'El género es obligatorio'],
    trim: true
  },
  plataforma: {
    type: String,
    required: [true, 'La plataforma es obligatoria'],
    trim: true
  },
  añoLanzamiento: {
    type: Number,
    min: [1950, 'El año debe ser mayor a 1950'],
    max: [new Date().getFullYear() + 5, 'El año no puede ser futuro']
  },
  desarrollador: {
    type: String,
    trim: true
  },
  imagenPortada: {
    type: String,  
    default: null
  },
  descripcion: {
    type: String,
    trim: true
  },
  completado: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  horasJugadas: { 
    type: Number, 
    default: 0 },
}, {
  timestamps: true  
})

const Game = mongoose.model('Game', gameSchema)

export default Game