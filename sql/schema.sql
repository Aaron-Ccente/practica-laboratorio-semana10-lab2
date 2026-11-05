CREATE DATABASE IF NOT EXISTS db_lab10
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_lab10;

CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NULL,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
  ('Laptop Lenovo', 'Laptop 14 pulgadas, 16GB RAM', 2899.90, 10),
  ('Mouse inalámbrico', 'Mouse óptico 2.4GHz', 49.50, 100),
  ('Teclado mecánico', 'Switch azul, retroiluminado', 159.00, 35);
