const express = require('express');
const fs      = require('fs');
const path    = require('path');
const router  = express.Router();

const notifsPath = path.join(__dirname, '../data/notificaciones.json');

function leerNotifs() {
  if (!fs.existsSync(notifsPath)) {
    fs.writeFileSync(notifsPath, '[]');
  }
  const data = fs.readFileSync(notifsPath, 'utf-8');
  return JSON.parse(data);
}

function guardarNotifs(notifs) {
  fs.writeFileSync(notifsPath, JSON.stringify(notifs, null, 2));
}

// Función exportable para crear notificaciones desde otros archivos
function crearNotificacion({ destinatario, titulo, mensaje, tipo }) {
  try {
    console.log('📨 Creando notificación para:', destinatario);
    const notifs = leerNotifs();
    const nueva  = {
      id:          Date.now().toString(),
      destinatario,
      titulo,
      mensaje,
      tipo:        tipo || 'info',
      leida:       false,
      fechaHora:   new Date().toLocaleString('es-MX')
    };
    notifs.push(nueva);
    guardarNotifs(notifs);
    console.log('✅ Notificación guardada correctamente');
    return nueva;
  } catch (err) {
    console.error('❌ Error al crear notificación:', err.message);
  }
}

// ── GET /api/notificaciones?destinatario=nombre ──
router.get('/', (req, res) => {
  const notifs       = leerNotifs();
  const destinatario = req.query.destinatario;

  if (destinatario) {
    const propias = notifs.filter(n =>
      n.destinatario.toLowerCase().includes(destinatario.toLowerCase())
    ).reverse();
    return res.json(propias);
  }
  res.json(notifs.reverse());
});

// ── PUT /api/notificaciones/:id/leer ── Marcar como leída
router.put('/:id/leer', (req, res) => {
  const notifs = leerNotifs();
  const index  = notifs.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Notificación no encontrada' });

  notifs[index].leida = true;
  guardarNotifs(notifs);
  res.json(notifs[index]);
});

// ── PUT /api/notificaciones/leer-todas ── Marcar todas como leídas
router.put('/leer-todas', (req, res) => {
  const { destinatario } = req.body;
  const notifs = leerNotifs();

  notifs.forEach(n => {
    if (!destinatario || n.destinatario.toLowerCase().includes(destinatario.toLowerCase())) {
      n.leida = true;
    }
  });

  guardarNotifs(notifs);
  res.json({ mensaje: 'Todas marcadas como leídas' });
});

// ── DELETE /api/notificaciones ── Limpiar
router.delete('/', (req, res) => {
  guardarNotifs([]);
  res.json({ mensaje: 'Notificaciones limpiadas' });
});

// ── POST /api/notificaciones ── Crear directamente
router.post('/', (req, res) => {
  const { destinatario, titulo, mensaje, tipo } = req.body;
  if (!destinatario || !titulo || !mensaje) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  const nueva = crearNotificacion({ destinatario, titulo, mensaje, tipo });
  res.status(201).json(nueva);
});

module.exports = router;
module.exports.crearNotificacion = crearNotificacion;