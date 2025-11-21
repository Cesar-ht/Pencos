import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`MongoDB conectado: ${conn.connection.host}`)
    console.log(`Base de datos: ${conn.connection.name}`)
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`)
    process.exit(1) 
  }
}

mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado a MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error(`Error en la conexión de Mongoose: ${err}`)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado de MongoDB')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('Conexión a MongoDB cerrada por terminación de la app')
  process.exit(0)
})

export default connectDB