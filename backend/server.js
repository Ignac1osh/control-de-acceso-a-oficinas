const express = require('express');
const cors    = require('cors');
const app     = express();
app.disable('x-powered-by');
const path   = require('path');

// Middlewares
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Rutas
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/accesos', require('./routes/accesos'));

// Ruta de prueba 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});

// Iniciar servidor
const PORT = 3000;

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).send('<h1>404 - No encontrado</h1><p>El recurso solicitado no existe en este servidor.</p>');
});
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});