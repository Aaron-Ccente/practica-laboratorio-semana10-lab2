const pool = require('../config/db');

// ---------- Validaciones ----------
const esIdValido = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

/**
 * Valida los campos del body. Si `parcial` es true, solo valida los campos presentes.
 * Devuelve un mensaje de error o null si todo está correcto.
 */
function validarProducto(body, parcial = false) {
  const { nombre, descripcion, precio, stock } = body || {};

  if (!parcial || nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim() === '' || nombre.length > 100) {
      return 'El campo "nombre" es obligatorio (texto de máximo 100 caracteres)';
    }
  }
  if (descripcion !== undefined && descripcion !== null) {
    if (typeof descripcion !== 'string' || descripcion.length > 255) {
      return 'El campo "descripcion" debe ser texto de máximo 255 caracteres';
    }
  }
  if (!parcial || precio !== undefined) {
    if (precio === undefined || precio === null || precio === '' || isNaN(Number(precio)) || Number(precio) < 0) {
      return 'El campo "precio" es obligatorio y debe ser un número >= 0';
    }
  }
  if (stock !== undefined) {
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return 'El campo "stock" debe ser un entero >= 0';
    }
  }
  return null;
}

// ---------- GET /api/productos ----------
exports.listar = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos ORDER BY id');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// ---------- GET /api/productos/:id ----------
exports.obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!esIdValido(id)) return res.status(400).json({ error: 'El id debe ser un entero positivo' });

    const [rows] = await pool.execute('SELECT * FROM productos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// ---------- POST /api/productos ----------
exports.crear = async (req, res, next) => {
  try {
    const error = validarProducto(req.body);
    if (error) return res.status(400).json({ error });

    const { nombre, descripcion = null, precio, stock = 0 } = req.body;
    // Prepared statement (execute) -> previene inyección SQL
    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
      [nombre.trim(), descripcion, precio, stock]
    );

    const [rows] = await pool.execute('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// ---------- PUT /api/productos/:id (total o parcial) ----------
exports.actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!esIdValido(id)) return res.status(400).json({ error: 'El id debe ser un entero positivo' });

    const permitidos = ['nombre', 'descripcion', 'precio', 'stock'];
    const campos = permitidos.filter((c) => req.body && req.body[c] !== undefined);
    if (campos.length === 0) {
      return res.status(400).json({ error: 'Envía al menos un campo a actualizar: ' + permitidos.join(', ') });
    }

    const error = validarProducto(req.body, true);
    if (error) return res.status(400).json({ error });

    // Los nombres de columna salen de una lista blanca; los valores van parametrizados.
    const set = campos.map((c) => `${c} = ?`).join(', ');
    const valores = campos.map((c) => (c === 'nombre' ? req.body[c].trim() : req.body[c]));

    const [result] = await pool.execute(`UPDATE productos SET ${set} WHERE id = ?`, [...valores, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const [rows] = await pool.execute('SELECT * FROM productos WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// ---------- DELETE /api/productos/:id (eliminación física) ----------
exports.eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!esIdValido(id)) return res.status(400).json({ error: 'El id debe ser un entero positivo' });

    const [result] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    res.status(200).json({ mensaje: 'Producto eliminado correctamente', id: Number(id) });
  } catch (err) {
    next(err);
  }
};
