INSERT INTO categoria (id, nombre) VALUES
('ADF', 'Adecuación funcional'),
('EFD', 'Eficiencia de desempeño'),
('COP', 'Compatibilidad'),
('CDI', 'Capacidad de Interacción  '),
('FIA', 'Fiabilidad'),
('SEG', 'Seguridad'),
('MNT', 'Mantenibilidad'),
('FLE', 'Flexibilidad')
('PRO', 'Protección');

INSERT INTO subcategoria (id, `categoriaId` ,nombre) VALUES 
('ADF1', 'ADF', 'Completitud funcional');
/* agregar más */

INSERT INTO pregunta (`subcategoriaId`, descripcion) VALUES
('ADF1', '¿El software incluye todas las funcionalidades necesarias para que el usuario logre sus objetivos sin recurrir a soluciones externas?');
/* agregar más */

-- ======================================================================

INSERT INTO licencia (nombre) VALUES
('MIT');
/* agregar más */

INSERT INTO tipo_software (nombre) VALUES
('Aplicación web');
/* agregar más */

INSERT INTO profesion (nombre) VALUES
('Ingeniero de Software');
/* agregar más */



