const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const fs       = require('fs');
const path     = require('path');
const router   = express.Router();

require('dotenv').config();
const SECRET = process.env.JWT_SECRET;
const usuariosPath = path.join(__dirname, '../data/usuarios.json');

// Códigos temporales en memoria
const codigosTemporal = {};

const empleadosAutorizados = [
  { nombre: 'Jesus Ramón Camarillo Núñez',   email: 'jcamarillo@nexusguard.com' },
  { nombre: 'Marco Gerardo Ceballos Valdez',  email: 'mceballos@nexusguard.com' },
  { nombre: 'Jesus Enrique Felix Olea',       email: 'jfelix@nexusguard.com' },
  { nombre: 'Claudia Guadalupe Romero',       email: 'cromero@nexusguard.com' },
  { nombre: 'Ignacio Sanz Hernandez',         email: 'isanz@nexusguard.com' },
  { nombre: 'José Luis Toscano Sosa',         email: 'jtoscano@nexusguard.com' },
];

function leerUsuarios() {
  const data = fs.readFileSync(usuariosPath, 'utf-8');
  return JSON.parse(data);
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
}

// ── POST /api/auth/registro ──
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  // Verificar si el correo está en la lista de autorizados
  const autorizado = empleadosAutorizados.find(e => e.email === email.toLowerCase());
  if (!autorizado) {
    return res.status(403).json({ 
      mensaje: 'Este correo no está autorizado para registrarse en el sistema' 
    });
  }

  const usuarios = leerUsuarios();
  const existe   = usuarios.find(u => u.email === email);

  if (existe) {
    return res.status(400).json({ mensaje: 'Este correo ya está registrado' });
  }

  const hash = await bcrypt.hash(password, 10);

  const nuevoUsuario = {
    id: Date.now().toString(),
    nombre,
    email,
    password: hash,
    creadoEn: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
});

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
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, nombre: usuario.nombre, email: usuario.email });
});

// ── POST /api/auth/verificar-correo ──
router.post('/verificar-correo', (req, res) => {
  const { email }  = req.body;
  const usuarios   = leerUsuarios();
  const usuario    = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Correo no registrado' });
  }

  const codigo = Math.floor(1000 + Math.random() * 9000).toString();

  // Guardar en memoria, NO en archivo (evita que Live Server recargue)
  codigosTemporal[email] = codigo;

console.log(`📧 Código generado exitosamente`);

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

  res.json({ mensaje: 'Contraseña actualizada exitosamente' });
});

module.exports = router;