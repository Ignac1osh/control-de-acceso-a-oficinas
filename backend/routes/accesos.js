require('dotenv').config();
const { registrarMovimiento } = require('./bitacora');
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const jwt     = require('jsonwebtoken');
const router  = express.Router();
const { crearNotificacion } = require('./notificaciones');

const accesosPath = path.join(__dirname, '../data/accesos.json');

function leerAccesos() {
    // Si el archivo no existe, lo crea automáticamente
    if (!fs.existsSync(accesosPath)) {
        fs.writeFileSync(accesosPath, '[]');
    }
    const data = fs.readFileSync(accesosPath, 'utf-8');
    return JSON.parse(data);
}

function guardarAccesos(accesos) {
  fs.writeFileSync(accesosPath, JSON.stringify(accesos, null, 2));
}

// ✅ Extrae el nombre del usuario desde el token JWT
function obtenerUsuarioDelToken(req) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return 'Sistema';
    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.nombre || 'Sistema';
  } catch (err) {
    return 'Sistema';
  }
}

// ── GET /api/accesos ── Obtener todos
router.get('/', (req, res) => {
  const accesos = leerAccesos();
  res.json(accesos);
});

// ── GET /api/accesos/:id ── Obtener uno
router.get('/:id', (req, res) => {
  const accesos = leerAccesos();
  const acceso  = accesos.find(a => a.id === req.params.id);
  if (!acceso) return res.status(404).json({ mensaje: 'Registro no encontrado' });
  res.json(acceso);
});

// ── POST /api/accesos ── Crear
router.post('/', (req, res) => {
  const accesos     = leerAccesos();
  const nuevoAcceso = {
    id: Date.now().toString(),
    ...req.body,
    creadoEn: new Date().toISOString()
  };
  accesos.push(nuevoAcceso);
  guardarAccesos(accesos);

  // ✅ Usa el token si existe, si no usa el vigilante del body
  const usuario = obtenerUsuarioDelToken(req) !== 'Sistema'
    ? obtenerUsuarioDelToken(req)
    : req.body.vigilante || 'Sistema';

  registrarMovimiento({
    usuario,
    accion:  'CREAR_CITA',
    detalle: `Nueva cita registrada para: ${req.body.visitante || req.body.nombre || '—'}`
  });

  if (req.body.empleadoVisitar) {
  crearNotificacion({
    destinatario: req.body.empleadoVisitar,
    titulo:       '📅 Nueva cita programada',
    mensaje:      `${req.body.visitante || 'Un visitante'} de ${req.body.empresa || '—'} tiene una cita contigo el ${req.body.fecha} a las ${req.body.hora}. Folio: ${req.body.folio || '—'}`,
    tipo:         'nueva_cita'
  });
}

  res.status(201).json(nuevoAcceso);
});

// ── PUT /api/accesos/:id ── Actualizar
router.put('/:id', (req, res) => {
  const accesos = leerAccesos();
  const index   = accesos.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Registro no encontrado' });

  accesos[index] = { ...accesos[index], ...req.body };
  guardarAccesos(accesos);

  // ✅ Siempre usa el token
  registrarMovimiento({
    usuario: obtenerUsuarioDelToken(req),
    accion:  'EDITAR_CITA',
    detalle: `Cita actualizada. Estado: ${req.body.estado || '—'}`
  });

  if (accesos[index].empleadoVisitar && req.body.estado) {
  const mensajes = {
    'Confirmada': '✅ Tu cita fue confirmada',
    'Rechazada':  '❌ Tu cita fue rechazada',
    'Cancelada':  '🚫 Tu cita fue cancelada',
    'Finalizada': '🏁 La visita ha finalizado'
  };
  if (mensajes[req.body.estado]) {
    crearNotificacion({
      destinatario: accesos[index].empleadoVisitar,
      titulo:       mensajes[req.body.estado],
      mensaje:      `La cita con ${accesos[index].visitante || '—'} (Folio: ${accesos[index].folio || '—'}) cambió a estado: ${req.body.estado}`,
      tipo:         'cambio_estado'
    });
  }
}
  res.json(accesos[index]);
});

// ── DELETE /api/accesos/:id ── Eliminar
router.delete('/:id', (req, res) => {
  let accesos = leerAccesos();
  const index = accesos.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Registro no encontrado' });

  const eliminado = accesos[index];
  accesos.splice(index, 1);
  guardarAccesos(accesos);

  // ✅ Usa el token en lugar de 'Admin' hardcodeado
  registrarMovimiento({
    usuario: obtenerUsuarioDelToken(req),
    accion:  'ELIMINAR_CITA',
    detalle: `Cita eliminada: ${eliminado.visitante || eliminado.nombre || '—'}`
  });

  res.json({ mensaje: 'Registro eliminado' });
});

module.exports = router;