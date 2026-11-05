const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productosRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ mensaje: 'API de Productos - Lab 10', endpoints: '/api/productos' }));
app.use('/api/productos', productosRoutes);

// 404 para rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador global de errores (nunca envía stack traces al cliente)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' });
  }
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ error: 'Registro duplicado' });
  }
  console.error(err); // el detalle solo queda en el log del servidor
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
