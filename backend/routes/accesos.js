const express   = require('express');
const fs        = require('fs');
const path      = require('path');
const router    = express.Router();

const accesosPath = path.join(__dirname, '../data/accesos.json');

function leerAccesos() {
  const data = fs.readFileSync(accesosPath, 'utf-8');
  return JSON.parse(data);
}

function guardarAccesos(accesos) {
  fs.writeFileSync(accesosPath, JSON.stringify(accesos, null, 2));
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
  const accesos    = leerAccesos();
  const nuevoAcceso = {
    id: Date.now().toString(),
    ...req.body,
    creadoEn: new Date().toISOString()
  };
  accesos.push(nuevoAcceso);
  guardarAccesos(accesos);
  res.status(201).json(nuevoAcceso);
});

// ── PUT /api/accesos/:id ── Actualizar
router.put('/:id', (req, res) => {
  const accesos = leerAccesos();
  const index   = accesos.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Registro no encontrado' });

  accesos[index] = { ...accesos[index], ...req.body };
  guardarAccesos(accesos);
  res.json(accesos[index]);
});

// ── DELETE /api/accesos/:id ── Eliminar
router.delete('/:id', (req, res) => {
  let accesos = leerAccesos();
  const index = accesos.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Registro no encontrado' });

  accesos.splice(index, 1);
  guardarAccesos(accesos);
  res.json({ mensaje: 'Registro eliminado' });
});

module.exports = router;