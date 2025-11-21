import { Router } from 'express'
import Review from '../models/Review.js'
import Game from '../models/Game.js'

const router = Router()

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('juegoId', 'titulo imagenPortada')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    next(error)
  }
}

export const getReviewsByGame = async (req, res, next) => {
  try {
    const reviews = await Review.find({ juegoId: req.params.gameId })
      .sort({ createdAt: -1 })
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    next(error)
  }
}

export const createReview = async (req, res, next) => {
  try {
    const { juegoId, puntuacion, textoReseña, horasJugadas, dificultad, recomendaria } = req.body

    if (!juegoId || !puntuacion) {
      return res.status(400).json({ 
        success: false,
        message: 'El juegoId y la puntuación son obligatorios' 
      })
    }

    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ 
        success: false,
        message: 'La puntuación debe estar entre 1 y 5' 
      })
    }

    if (!textoReseña || textoReseña.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'El texto de la reseña es obligatorio' 
      })
    }

    const game = await Game.findById(juegoId)
    if (!game) {
      return res.status(404).json({ 
        success: false,
        message: 'Juego no encontrado' 
      })
    }

    const review = await Review.create({ 
      juegoId, 
      puntuacion, 
      textoReseña, 
      horasJugadas: horasJugadas || 0,
      dificultad: dificultad || 'Normal',
      recomendaria: recomendaria !== undefined ? recomendaria : true
    })
    
    res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
      data: review
    })
  } catch (error) {
    next(error)
  }
}

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
    
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Reseña no encontrada' 
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Reseña actualizada exitosamente',
      data: review
    })
  } catch (error) {
    next(error)
  }
}

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    
    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Reseña no encontrada' 
      })
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Reseña eliminada exitosamente'
    })
  } catch (error) {
    next(error)
  }
}

router.get('/', getAllReviews)
router.get('/game/:gameId', getReviewsByGame)
router.post('/', createReview)
router.put('/:id', updateReview)
router.delete('/:id', deleteReview)

export default router