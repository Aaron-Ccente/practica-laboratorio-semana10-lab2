require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Conexión a MySQL OK');
    conn.release();
  } catch (err) {
    console.error('No se pudo conectar a MySQL:', err.message);
  }
  app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
})();
