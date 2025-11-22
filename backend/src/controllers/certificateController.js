import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import fs from 'fs';

// [ADMIN] Subir certificado para un usuario
export const subirCertificado = async (req, res) => {
  try {
    const { usuarioId, fechaEmision, fechaVencimiento } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Debe subir un archivo PDF' });
    }

    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si ya tiene certificado, eliminar el anterior
    if (usuario.certificado) {
      await Certificate.findByIdAndDelete(usuario.certificado);
    }

    // Leer el archivo PDF como Buffer
    const archivoPDF = fs.readFileSync(req.file.path);

    const certificado = await Certificate.create({
      usuario: usuarioId,
      nombreArchivo: `Certificado_Alturas_${usuario.cedula}.pdf`,
      archivoPDF: archivoPDF,
      tipoArchivo: req.file.mimetype,
      fechaEmision: new Date(fechaEmision),
      fechaVencimiento: new Date(fechaVencimiento),
      subidoPor: req.user.id
    });

    // Eliminar archivo temporal del servidor
    fs.unlinkSync(req.file.path);

    // Asociar certificado al usuario
    usuario.certificado = certificado._id;
    await usuario.save({ validateBeforeSave: false });

    res.status(201).json({
      message: 'Certificado subido correctamente',
      certificado: {
        id: certificado._id,
        nombreArchivo: certificado.nombreArchivo,
        fechaEmision: certificado.fechaEmision,
        fechaVencimiento: certificado.fechaVencimiento,
        estado: certificado.estado
      }
    });
  } catch (err) {
    // Limpiar archivo temporal si hay error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error al subir certificado', error: err.message });
  }
};

// [USUARIO] Obtener info de su certificado
export const miCertificado = async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).populate('certificado');
    
    if (!usuario.certificado) {
      return res.status(404).json({ message: 'No tienes certificado asignado' });
    }

    const cert = usuario.certificado;
    cert.verificarVigencia();

    res.json({
      nombreArchivo: cert.nombreArchivo,
      fechaEmision: cert.fechaEmision,
      fechaVencimiento: cert.fechaVencimiento,
      estado: cert.estado
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener certificado' });
  }
};

// [USUARIO] Descargar su certificado PDF
export const descargarCertificado = async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).populate('certificado');
    
    if (!usuario.certificado) {
      return res.status(404).json({ message: 'No tienes certificado' });
    }

    const cert = usuario.certificado;

    // Enviar el PDF desde la base de datos
    res.set({
      'Content-Type': cert.tipoArchivo,
      'Content-Disposition': `attachment; filename="${cert.nombreArchivo}"`,
      'Content-Length': cert.archivoPDF.length
    });

    res.send(cert.archivoPDF);
  } catch (err) {
    res.status(500).json({ message: 'Error al descargar' });
  }
};

// [ADMIN] Listar todos los certificados (sin incluir el PDF para no sobrecargar)
export const listarCertificados = async (req, res) => {
  try {
    const certificados = await Certificate.find()
      .select('-archivoPDF')  // Excluir el PDF de la lista
      .populate('usuario', 'cedula nombre')
      .sort({ createdAt: -1 });
    res.json(certificados);
  } catch (err) {
    res.status(500).json({ message: 'Error al listar certificados' });
  }
};