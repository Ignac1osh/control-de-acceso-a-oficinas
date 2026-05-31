const bcrypt = require('bcryptjs');
const fs     = require('fs');
const path   = require('path');

const usuariosPath = path.join(__dirname, 'data/usuarios.json');

async function setup() {
  const password = await bcrypt.hash('Nexus2024', 10);
  const creadoEn = new Date().toISOString();

  const empleados = [
    { id: '1', nombre: 'Jesus Ramon Camarillo Nunez',   email: 'jcamarillo@nexusguard.com',  password, rol: 'admin',     creadoEn },
    { id: '2', nombre: 'Marco Gerardo Ceballos Valdez',  email: 'mceballos@nexusguard.com',   password, rol: 'admin',     creadoEn },
    { id: '3', nombre: 'Jesus Enrique Felix Olea',       email: 'jfelix@nexusguard.com',      password, rol: 'admin',     creadoEn },
    { id: '4', nombre: 'Claudia Guadalupe Romero',       email: 'cromero@nexusguard.com',     password, rol: 'admin',     creadoEn },
    { id: '5', nombre: 'Ignacio Sanz Hernandez',         email: 'isanz@nexusguard.com',       password, rol: 'admin',     creadoEn },
    { id: '6', nombre: 'Jose Luis Toscano Sosa',         email: 'jtoscano@nexusguard.com',    password, rol: 'admin',     creadoEn },
    { id: '7', nombre: 'Fidel Bojorquez Solis',          email: 'fbojorquez@nexusguard.com',  password, rol: 'admin',     creadoEn },
    { id: '8', nombre: 'Vigilante Caseta Principal',     email: 'vigilancia1@nexusguard.com', password, rol: 'vigilante', creadoEn },
    { id: '9', nombre: 'Vigilante Caseta Secundaria',    email: 'vigilancia2@nexusguard.com', password, rol: 'vigilante', creadoEn },
  ];

  fs.writeFileSync(usuariosPath, JSON.stringify(empleados, null, 2));
  console.log('✅ Usuarios configurados correctamente');
  console.log('');
  console.log('👨‍💼 ADMINS:');
  console.log('   jcamarillo@nexusguard.com  →  Nexus2024');
  console.log('   mceballos@nexusguard.com   →  Nexus2024');
  console.log('   jfelix@nexusguard.com      →  Nexus2024');
  console.log('   cromero@nexusguard.com     →  Nexus2024');
  console.log('   isanz@nexusguard.com       →  Nexus2024');
  console.log('   jtoscano@nexusguard.com    →  Nexus2024');
  console.log('   fbojorquez@nexusguard.com  →  Nexus2024');
  console.log('');
  console.log('👮 VIGILANTES:');
  console.log('   vigilancia1@nexusguard.com →  Nexus2024');
  console.log('   vigilancia2@nexusguard.com →  Nexus2024');
}

setup();