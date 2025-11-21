import Review from '../models/Review.js'

export const createReview = async (req, res, next) => {
  try {
    const { juegoId, puntuacion, textoReseña, horasJugadas, dificultad, recomendaria } = req.body
    
    if (!juegoId || !puntuacion) {
      return res.status(400).json({ message: 'El juegoId y la puntuación son obligatorios' })
    }

    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ message: 'La puntuación debe estar entre 1 y 5' })
    }

    const review = await Review.create({ 
      juegoId, 
      puntuacion, 
      textoReseña, 
      horasJugadas, 
      dificultad, 
      recomendaria 
    })
    
    res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}

export const getReviewsByGame = async (req, res, next) => {
  try {
    const reviews = await Review.find({ juegoId: req.params.gameId })
      .sort({ createdAt: -1 })
    res.json(reviews)
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
      return res.status(404).json({ message: 'Reseña no encontrada' })
    }
    
    res.json(review)
  } catch (error) {
    next(error)
  }
}

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' })
    }
    
    res.json({ message: 'Reseña eliminada' })
  } catch (error) {
    next(error)
  }
}