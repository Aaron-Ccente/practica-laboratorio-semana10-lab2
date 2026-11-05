# API REST de Productos – Lab 10

CRUD de productos con **Node.js, Express y mysql2/promise** (async/await, pool de conexiones, prepared statements), organizado en estructura MVC.

## Estructura
```
src/
  config/db.js                    # Pool de conexiones (mysql2/promise)
  controllers/productosController.js
  routes/productosRoutes.js
  app.js                          # Express, middlewares, manejo global de errores
  server.js                       # Arranque del servidor
sql/schema.sql                    # Crea db_lab10 y la tabla productos
docs/postman_collection.json      # Collection para Postman / Insomnia
```

## Puesta en marcha
1. `npm install`
2. Copia `.env.example` a `.env` y completa tus credenciales de MySQL (`.env` está en `.gitignore`).
3. Ejecuta el script de base de datos: `mysql -u root -p < sql/schema.sql`
4. `npm start` (o `npm run dev` con recarga automática, Node 18+).

El servidor queda en `http://localhost:3000`.

## Endpoints
| Verbo | Ruta | Propósito | Éxito | Errores |
|-------|------|-----------|-------|---------|
| GET | `/api/productos` | Lista todos los productos | 200 | 500 |
| GET | `/api/productos/:id` | Obtiene un producto | 200 | 400, 404, 500 |
| POST | `/api/productos` | Crea un producto | 201 | 400, 500 |
| PUT | `/api/productos/:id` | Actualiza un producto (total o parcial: solo se modifican los campos enviados) | 200 | 400, 404, 500 |
| DELETE | `/api/productos/:id` | Elimina físicamente un producto | 200 | 400, 404, 500 |

### Body de ejemplo (POST / PUT)
```json
{ "nombre": "Monitor 24\"", "descripcion": "Full HD IPS", "precio": 599.90, "stock": 15 }
```
- `nombre` (obligatorio en POST), `precio` (obligatorio en POST, >= 0), `descripcion` y `stock` (opcionales).

### Formato de errores
```json
{ "error": "Producto no encontrado" }
```
Nunca se envían stack traces; el detalle de errores 500 solo se registra en consola del servidor.

## Pruebas con Postman / Insomnia
Importa `docs/postman_collection.json`. Incluye casos para los 4 verbos, validaciones de status code, header `Content-Type: application/json` y casos de error (400/404). Ejecuta la collection en orden: el POST guarda el `id` creado en la variable `productoId`, que usan el PUT y el DELETE.

## Notas técnicas
- **Prepared statements** (`pool.execute` con `?`) para prevenir inyección SQL.
- **Eliminación física** (`DELETE FROM`). Para eliminación lógica agrega una columna `activo TINYINT(1)` y cambia el DELETE por un `UPDATE ... SET activo = 0`.
