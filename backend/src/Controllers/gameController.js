import Game from '../models/Game.js'
import User from '../models/User.js'

export const getGames = async (req, res, next) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 })
    res.json(games)
  } catch (error) {
    next(error)
  }
}

export const getGameById = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id)
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' })
    res.json(game)
  } catch (error) {
    next(error)
  }
}

export const createGame = async (req, res, next) => {
  try {
    const { titulo, plataforma, genero, añoLanzamiento, desarrollador, imagenPortada, descripcion, horasJugadas, completado } = req.body
    
    if (!titulo || !plataforma) {
      return res.status(400).json({ message: 'El título y la plataforma son obligatorios' })
    }
    
    const newGame = await Game.create({ 
      titulo, 
      plataforma, 
      genero, 
      añoLanzamiento, 
      desarrollador, 
      imagenPortada, 
      descripcion,
      horasJugadas,
      completado 
    })
    res.status(201).json(newGame)
  } catch (error) {
    next(error)
  }
}

export const updateGame = async (req, res, next) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  
    )
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' })
    res.json(game)
  } catch (error) {
    next(error)
  }
}

export const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id)
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' })
    res.json({ message: 'Juego eliminado correctamente' })
  } catch (error) {
    next(error)
  }
}

export const getGamesTienda = async (req, res) => {
  try {
    const juegos = await Game.find()
    res.json(juegos)
  } catch (error) {
    console.error('Error al obtener juegos de tienda:', error)
    res.status(500).json({ message: 'Error al obtener juegos' })
  }
}

// GET: Biblioteca del usuario autenticado
export const getBibliotecaUsuario = async (req, res) => {
  try {
    const userId = req.user.id 
    
    const user = await User.findById(userId).populate('biblioteca')
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    
    res.json(user.biblioteca)
  } catch (error) {
    console.error('Error al obtener biblioteca:', error)
    res.status(500).json({ message: 'Error al obtener biblioteca' })
  }
}

// POST: Agregar juego a la biblioteca del usuario
export const agregarABiblioteca = async (req, res) => {
  try {
    const userId = req.user.id
    const { juegoId } = req.params
    
    // Verificar que el juego existe
    const juego = await Game.findById(juegoId)
    if (!juego) {
      return res.status(404).json({ message: 'Juego no encontrado' })
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { biblioteca: juegoId } },
      { new: true }
    ).populate('biblioteca')
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    
    res.json({ 
      message: 'Juego agregado a la biblioteca',
      biblioteca: user.biblioteca 
    })
  } catch (error) {
    console.error('Error al agregar a biblioteca:', error)
    res.status(500).json({ message: 'Error al agregar juego' })
  }
}

// DELETE: Eliminar juego de la biblioteca del usuario
export const eliminarDeBiblioteca = async (req, res) => {
  try {
    const userId = req.user.id
    const { juegoId } = req.params

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { biblioteca: juegoId } },
      { new: true }
    ).populate('biblioteca')

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({ 
      message: 'Juego eliminado de la biblioteca',
      biblioteca: user.biblioteca 
    })
  } catch (error) {
    console.error('Error al eliminar de biblioteca:', error)
    res.status(500).json({ message: 'Error al eliminar el juego' })
  }
}