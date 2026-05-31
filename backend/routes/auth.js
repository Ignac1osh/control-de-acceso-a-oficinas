require('dotenv').config();
const { registrarMovimiento } = require('./bitacora');
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const fs       = require('fs');
const path     = require('path');
const router   = express.Router();

const SECRET       = process.env.JWT_SECRET || 'clave_temporal';
const usuariosPath = path.join(__dirname, '../data/usuarios.json');

const codigosTemporal = {};

function leerUsuarios() {
  const data = fs.readFileSync(usuariosPath, 'utf-8');
  return JSON.parse(data);
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
}

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const usuarios = leerUsuarios();
  const usuario  = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  const token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    SECRET,
    { expiresIn: '8h' }
  );

  registrarMovimiento({
  usuario: usuario.nombre,
  accion:  'LOGIN',
  detalle: `Inicio de sesion: ${usuario.email}`
});

  res.json({ token, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
});

// ── POST /api/auth/verificar-correo ──
router.post('/verificar-correo', (req, res) => {
  const { email } = req.body;
  const usuarios  = leerUsuarios();
  const usuario   = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Correo no registrado' });
  }

  const codigo = Math.floor(1000 + Math.random() * 9000).toString();
  codigosTemporal[email] = codigo;

  console.log('Código de recuperación generado correctamente');

  res.json({ codigo, mensaje: 'Código generado exitosamente' });
});

// ── POST /api/auth/cambiar-password ──
router.post('/cambiar-password', async (req, res) => {
  const { email, password } = req.body;
  const usuarios = leerUsuarios();
  const index    = usuarios.findIndex(u => u.email === email);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  usuarios[index].password = await bcrypt.hash(password, 10);
  guardarUsuarios(usuarios);
  delete codigosTemporal[email];

  registrarMovimiento({
  usuario: usuarios[index].nombre,
  accion:  'CAMBIO_PASSWORD',
  detalle: `Cambio de contrasena para: ${email}`
});

  res.json({ mensaje: 'Contraseña actualizada exitosamente' });
});

module.exports = router;