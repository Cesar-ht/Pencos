import { Router } from 'express'
import {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getGamesTienda,
  getBibliotecaUsuario,
  agregarABiblioteca,
  eliminarDeBiblioteca
} from '../Controllers/gameController.js'
import { authMiddleware } from '../middlewares/auth.js' 

const router = Router()

// Rutas públicas
router.get('/', getGames)
router.get('/tienda', getGamesTienda) // Todos los juegos para la tienda
router.get('/user/biblioteca', authMiddleware, getBibliotecaUsuario) // Biblioteca del usuario
router.get('/:id', getGameById)
router.post('/', createGame)
router.put('/:id', updateGame)
router.delete('/:id', deleteGame)

// Rutas protegidas (requieren autenticación)
router.post('/biblioteca/:juegoId', authMiddleware, agregarABiblioteca) // Agregar a biblioteca
router.delete('/biblioteca/:juegoId', authMiddleware, eliminarDeBiblioteca) // Eliminar de biblioteca

export default router