const express = require('express');
const cors    = require('cors');
const app     = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/accesos', require('./routes/accesos'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '✅ Servidor Nexus Guard funcionando' });
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