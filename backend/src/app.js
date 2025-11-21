import express from 'express'
import cors from 'cors'
import gameRoutes from './routes/gameRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js' 
import errorHandler from './middlewares/errorHandler.js'
import authRoutes from './routes/auth.js'
const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a GameTracker API',
    version: '1.0.0',
    endpoints: {
      games: '/api/games',
      reviews: '/api/reviews',
      auth: '/api/auth'
    }
  })
})

app.use('/api/games', gameRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/auth', authRoutes) 

app.use(errorHandler)

export default app