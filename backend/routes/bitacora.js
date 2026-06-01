const express = require('express');
const fs      = require('fs');
const path    = require('path');
const router  = express.Router();

const bitacoraPath = path.join(__dirname, '../data/bitacora.json');

function leerBitacora() {
    // Si el archivo no existe, lo crea con un arreglo vacío
    if (!fs.existsSync(bitacoraPath)) {
        fs.writeFileSync(bitacoraPath, '[]');
    }
    const data = fs.readFileSync(bitacoraPath, 'utf-8');
    return JSON.parse(data);
}

function guardarBitacora(registros) {
  fs.writeFileSync(bitacoraPath, JSON.stringify(registros, null, 2));
}

// Función exportable para registrar desde otros archivos
function registrarMovimiento({ usuario, accion, detalle }) {
  const registros = leerBitacora();
  const nuevo = {
    id:       Date.now().toString(),
    usuario:  usuario  || 'Sistema',
    accion,
    detalle:  detalle  || '',
    fechaHora: new Date().toLocaleString('es-MX')
  };
  registros.push(nuevo);
  guardarBitacora(registros);
}

// ── GET /api/bitacora ── Obtener todos
router.get('/', (req, res) => {
  const registros = leerBitacora();
  res.json(registros.reverse()); // Más recientes primero
});

// ── DELETE /api/bitacora ── Limpiar bitácora
router.delete('/', (req, res) => {
  guardarBitacora([]);
  res.json({ mensaje: 'Bitácora limpiada correctamente' });
});

module.exports = router;
module.exports.registrarMovimiento = registrarMovimiento;