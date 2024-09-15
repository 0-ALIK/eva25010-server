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
('Software Libre'),
('Copyleft'),
('GPL'),
('Debian'),
('BSD'),
('Dominio Público'),
('Semi-libre'),
('Freeware'),
('Comercial'),
('Trial');

INSERT INTO tipo_software (nombre) VALUES
('Software de Sistema'),
('Software de Programación'),
('Software de Aplicación');

INSERT INTO sub_tipo_software (`tipo_softwareId`, nombre) VALUES
(1, 'Cargador de Programa'),
(1, 'Sistema Operativo'),
(1, 'Controlador'),
(1, 'Herramienta de Diagnóstico'),
(1, 'Servidor'),
(2, 'Editor de Texto'),
(2, 'Compilador'),
(2, 'Intérprete'),
(2, 'Enlazador'),
(2, 'Depurador'),
(2, 'IDE'),
(3, 'Aplicación Ofimática'),
(3, 'Base de Datos'),
(3, 'Videojuego'),
(3, 'Software Empresarial'),
(3, 'Software Educativo'),
(3, 'Software de Gestión');

INSERT INTO profesion (nombre) VALUES
('Ingeniero de Software'),
('Desarrollador de Software'),
('Arquitecto de Software'),
('Administrador de Sistemas'),
('Analista de Sistemas'),
('Ingeniero de Pruebas (QA)'),
('Administrador de Base de Datos'),
('Desarrollador Front-End'),
('Desarrollador Back-End'),
('DevOps Engineer'),
('Ingeniero de Machine Learning'),
('Científico de Datos'),
('Administrador de Redes'),
('Consultor de Software'),
('Ingeniero de Ciberseguridad'),
('Gerente de Proyectos de Software'),
('Especialista en UX/UI'),
('Ingeniero de Automatización');
