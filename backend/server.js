const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Importación de seguridad para SonarQube
const path = require('path');
const authRoutes = require('./routes/auth');
const accesosRoutes = require('./routes/accesos');

const app = express();

// Oculta la huella digital del servidor para mitigar vulnerabilidades
app.disable('x-powered-by'); 

// Configuración de Middlewares de seguridad y comunicación
app.use(cors());
app.use(helmet()); 

// Procesadores de datos para peticiones del cuerpo (Body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend (sube un nivel para encontrar las carpetas)
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Enrutamiento de la API REST
app.use('/api/auth', authRoutes);
app.use('/api/accesos', accesosRoutes);

// Servir las páginas HTML principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../accesos.html'));
});

// Manejo de errores 404 (Ruta no encontrada)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../404.html'));
});

// Inicialización del servidor local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Nexus Guard corriendo perfectamente en http://localhost:${PORT}`);
});