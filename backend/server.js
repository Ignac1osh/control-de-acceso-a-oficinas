require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

// ✅ Ocultar versión de Express
app.disable('x-powered-by');

// ✅ CORS restringido solo a orígenes conocidos
const origenesPermitidos = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origenesPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/accesos', require('./routes/accesos'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor Nexus Guard funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});