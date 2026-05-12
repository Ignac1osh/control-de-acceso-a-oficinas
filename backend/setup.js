const bcrypt = require('bcryptjs');
const fs     = require('fs');
const path   = require('path');

const usuariosPath = path.join(__dirname, 'data/usuarios.json');

async function setup() {
  const password = await bcrypt.hash('Nexus2024', 10);

  const empleados = [
    { id: '1', nombre: 'Jesus Ramón Camarillo Núñez',  email: 'jcamarillo@nexusguard.com', password },
    { id: '2', nombre: 'Marco Gerardo Ceballos Valdez', email: 'mceballos@nexusguard.com',  password },
    { id: '3', nombre: 'Jesus Enrique Felix Olea',      email: 'jfelix@nexusguard.com',     password },
    { id: '4', nombre: 'Claudia Guadalupe Romero',      email: 'cromero@nexusguard.com',    password },
    { id: '5', nombre: 'Ignacio Sanz Hernandez',        email: 'isanz@nexusguard.com',      password },
    { id: '6', nombre: 'José Luis Toscano Sosa',        email: 'jltoscano@nexusguard.com',   password },
  ];

  fs.writeFileSync(usuariosPath, JSON.stringify(empleados, null, 2));
  console.log('✅ Los 6 empleados han sido registrados exitosamente');
  console.log('📧 Contraseña inicial para todos: Nexus2024');
}

setup();