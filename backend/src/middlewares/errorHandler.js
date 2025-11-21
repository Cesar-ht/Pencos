const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack)
  
  res.status(err.status || 500).json({
    success: false,
    error: true,
    message: err.message || 'Error interno del servidor'
  })
}

export default errorHandler