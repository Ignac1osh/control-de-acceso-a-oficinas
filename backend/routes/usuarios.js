const { registrarMovimiento } = require('./bitacora');
const express = require('express');
const bcrypt  = require('bcryptjs');
const fs      = require('fs');
const path    = require('path');
const router  = express.Router();

const usuariosPath = path.join(__dirname, '../data/usuarios.json');

function leerUsuarios() {
    // Evita errores si borras el JSON de usuarios por accidente
    if (!fs.existsSync(usuariosPath)) {
        fs.writeFileSync(usuariosPath, '[]');
    }
    const data = fs.readFileSync(usuariosPath, 'utf-8');
    return JSON.parse(data);
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
}

// ── GET /api/usuarios ── Obtener todos
router.get('/', (req, res) => {
  const usuarios = leerUsuarios();
  // No enviar las contraseñas
  const seguros  = usuarios.map(({ password, ...resto }) => resto);
  res.json(seguros);
});

// ── GET /api/usuarios/:id ── Obtener uno
router.get('/:id', (req, res) => {
  const usuarios = leerUsuarios();
  const usuario  = usuarios.find(u => u.id === req.params.id);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  const { password, ...seguro } = usuario;
  res.json(seguro);
});

// ── POST /api/usuarios ── Crear
router.post('/', async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const usuarios = leerUsuarios();
  const existe   = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(400).json({ mensaje: 'Este correo ya está registrado' });
  }

  const hash = await bcrypt.hash(password, 10);
  const nuevo = {
    id: Date.now().toString(),
    nombre,
    email,
    password: hash,
    rol,
    creadoEn: new Date().toISOString()
  };

  usuarios.push(nuevo);
  guardarUsuarios(usuarios);

  const { password: _, ...seguro } = nuevo;

  registrarMovimiento({
  usuario: 'Admin',
  accion:  'CREAR_USUARIO',
  detalle: `Nuevo usuario creado: ${nuevo.nombre} (${nuevo.rol})`
});
  res.status(201).json(seguro);
});

// ── PUT /api/usuarios/:id ── Actualizar
router.put('/:id', async (req, res) => {
  const usuarios = leerUsuarios();
  const index    = usuarios.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  const { nombre, email, rol, password } = req.body;

  if (nombre)  usuarios[index].nombre = nombre;
  if (email)   usuarios[index].email  = email;
  if (rol)     usuarios[index].rol    = rol;
  if (password) {
    usuarios[index].password = await bcrypt.hash(password, 10);
  }

  guardarUsuarios(usuarios);

  const { password: _, ...seguro } = usuarios[index];
  
  registrarMovimiento({
  usuario: 'Admin',
  accion:  'EDITAR_USUARIO',
  detalle: `Usuario actualizado: ${usuarios[index].nombre}`
});
  res.json(seguro);
});

// ── DELETE /api/usuarios/:id ── Eliminar
router.delete('/:id', (req, res) => {
  let usuarios = leerUsuarios();
  const index  = usuarios.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  usuarios.splice(index, 1);
  guardarUsuarios(usuarios);
  registrarMovimiento({
    usuario: 'Admin',
    accion:  'ELIMINAR_USUARIO',
    detalle: `Usuario eliminado: ${usuarios[index].nombre}`
  });
  res.json({ mensaje: 'Usuario eliminado correctamente' });
});

module.exports = router;