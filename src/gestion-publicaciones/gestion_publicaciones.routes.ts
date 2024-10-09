import { Router } from "express";
import { SoftwareController } from "./controllers/software.controller";
import { validarSesion } from "../global/middlewares/validar-sesion";
import { mostrarErrores } from "../global/middlewares/mostrar-errores";
import { filesToBody } from "../global/middlewares/files";
import { parseJsonCampos } from "../global/middlewares/parse-json-campos";
import { check } from "express-validator";
import { imagenExtensiones, validarExtension } from "../global/validators/validar-extension";
import { existeCategoria, existeLicencia, existePreguntaCustom, existeSoftwareCategoria, existeSubtipoSoftware, existeTecnologia, softwareCategoriaPerteneceSoftware, softwareCategoriaTienePregunta } from "./validators/existe-software";
import { softwarePertenece } from "./middlewares/pertenece";
import { existeCategoriaEnSoftware, existePreguntaCustomEnCategoria } from "./middlewares/existe";

export class GestionPublicacionesRoutes {

    public static get routes(): Router {
        const router = Router();

        const softwareController = new SoftwareController();

        router.get('/software', [
            check('search', 'El campo search debe ser string').optional().isString(),
            check('search', 'El campo search debe tener entre 1 y 100 caracteres').optional().isLength({ min: 1, max: 100 }),
            check('tipo', 'El campo tipo debe ser un número').optional().isNumeric(),
            check('licencia', 'El campo licencia debe ser un número').optional().isNumeric(),
            mostrarErrores
        ], softwareController.obtener);

        router.post('/software', [
            validarSesion,
            filesToBody,
            parseJsonCampos(['categorias', 'tecnologias']),
            check('nombre', 'El nombre es requerido').notEmpty(),
            check('nombre', 'El nombre debe tener entre 5 y 100 caracteres').isLength({ min: 5, max: 100 }),
            check('descripcion', 'La descripción es requerida').notEmpty(),
            check('version', 'La versión es requerida').notEmpty(),
            check('version', 'La versión debe tener entre 1 y 20 caracteres').isLength({ min: 1, max: 20 }),
            check('licencia', 'La licencia es requerida').notEmpty(),
            check('licencia', 'La licencia debe ser un número').isNumeric(),
            check('licencia').custom( existeLicencia ),
            check('subtipoSoftware', 'El subtipo de software es requerido').notEmpty(),
            check('subtipoSoftware', 'El subtipo de software debe ser un número').isNumeric(),
            check('subtipoSoftware').custom( existeSubtipoSoftware ),
            check('portada', 'La portada es requerida').notEmpty(),
            check('portada', 'La portada no es un archivo').isObject(),
            check('portada').custom( archivo => validarExtension(archivo, [...imagenExtensiones ])),
            check('imagenesPreview.*', 'Una de las imagenes preview no es archivo').optional().isObject(),
            check('imagenesPreview.*').custom( archivo => validarExtension(archivo, [...imagenExtensiones ])),
            check('categorias', 'Las categorias son requeridas').notEmpty(),
            check('categorias.*.categoria', 'La categoria debe ser string').notEmpty().isString(),
            check('categorias.*.categoria').custom( existeCategoria ),
            check('categorias.*.pregunta', 'La pregunta es requerida').optional().isString(),
            check('tecnologias', 'Las tecnologias son requeridas').isArray(),
            check('tecnologias.*', 'Una de las tecnologias no es un número').isNumeric(),
            check('tecnologias.*').custom( existeTecnologia ),
            mostrarErrores
        ], softwareController.crear);

        router.put('/software/:softwareid', [
            validarSesion,
            filesToBody,
            parseJsonCampos(['tecnologias']),
            check('softwareid', 'El id del software es requerido').notEmpty(),
            check('softwareid', 'El id del software debe ser un número').isNumeric(),
            softwarePertenece(),
            check('nombre', 'El nombre debe tener entre 5 y 100 caracteres').optional().isLength({ min: 5, max: 100 }),
            check('descripcion', 'La descripción es requerida').optional().notEmpty(),
            check('version', 'La versión debe tener entre 1 y 20 caracteres').optional().isLength({ min: 1, max: 20 }),
            check('licencia', 'La licencia debe ser un número').optional().isNumeric(),
            check('licencia').optional().custom( existeLicencia ),
            check('subtipoSoftware', 'El subtipo de software debe ser un número').optional().isNumeric(),
            check('subtipoSoftware').optional().custom( existeSubtipoSoftware ),
            check('tecnologias', 'Las tecnologias son requeridas').optional().isArray(),
            check('tecnologias.*', 'Una de las tecnologias no es un número').optional().isNumeric(),
            check('tecnologias.*').optional().custom( existeTecnologia ),
            mostrarErrores
        ], softwareController.editar);

        router.get('/software/licencias', softwareController.obtenerLicencias);

        router.get('/software/tipos', softwareController.obtenerTipos);

        router.get('/software/subtipos/:tipoid', [
            check('tipoid', 'El id del tipo es requerido').notEmpty(),
            check('tipoid', 'El id del tipo debe ser un número').isNumeric(),
            mostrarErrores
        ], softwareController.obtenerSubtipos);

        router.get('/software/propios', validarSesion, softwareController.obtenerSoftwarePropio);

        router.get('/software/propios/:softwareid', [
            validarSesion,
            check('softwareid', 'El id del software es requerido').notEmpty(),
            check('softwareid', 'El id del software debe ser un número').isNumeric(),
            softwarePertenece(),
            mostrarErrores
        ], softwareController.obtenerSoftwarePropiosById);

        router.get('/software/obtener/:softwareid', [
            check('softwareid', 'El id del software es requerido').notEmpty(),
            check('softwareid', 'El id del software debe ser un número').isNumeric(),
            mostrarErrores
        ], softwareController.obtenerById)

        router.post('/software/portada/:softwareid', [
            validarSesion,
            filesToBody,
            check('softwareid', 'El id del software es requerido').notEmpty(),
            check('softwareid', 'El id del software debe ser un número').isNumeric(),
            softwarePertenece(),
            check('portada', 'La portada es requerida').notEmpty(),
            check('portada', 'La portada no es un archivo').isObject(),
            check('portada').custom( archivo => validarExtension(archivo, [...imagenExtensiones ])),
            mostrarErrores
        ], softwareController.editarPortada);

        router.post('/software/imagenes-preview/:softwareid', [
            validarSesion,
            filesToBody,
            check('softwareid', 'El id del software es requerido').notEmpty(),
            check('softwareid', 'El id del software debe ser un número').isNumeric(),
            softwarePertenece(),
            check('imagenPreview', 'La imagen preview es requerida').notEmpty(),
            check('imagenPreview', 'La imagen preview no es un archivo').isObject(),
            check('imagenPreview').custom( archivo => validarExtension(archivo, [...imagenExtensiones ])),
            mostrarErrores
        ], softwareController.agregarImagenPreview);

        router.delete('/software/imagenes-preview/:softwareid/:imagenid', [
            validarSesion,
            check('softwareid', 'El id del software es requerido').notEmpty(),
            check('softwareid', 'El id del software debe ser un número').isNumeric(),
            softwarePertenece(),
            check('imagenid', 'El id de la imagen preview es requerido').notEmpty(),
            check('imagenid', 'El id de la imagen preview debe ser un número').isNumeric(),
            mostrarErrores
        ], softwareController.eliminarImagenPreview);

        router.post('/software/categorias/:softwareid/:categoriaid', [
            validarSesion,
            check('softwareid', 'El id del software es requerido').notEmpty(),
            softwarePertenece(),
            check('categoriaid', 'El id de la categoria es requerido').notEmpty(),
            check('categoriaid', 'El id de la categoria debe ser un número').isNumeric(),
            check('categoriaid').custom( existeCategoria ),
            existeCategoriaEnSoftware(false),
            mostrarErrores
        ], softwareController.agregarCategoria);

        router.delete('/software/categorias/:softwareid/:categoriaid', [
            validarSesion,
            check('softwareid', 'El id del software es requerido').notEmpty(),
            softwarePertenece(),
            check('categoriaid', 'El id de la categoria es requerido').notEmpty(),
            check('categoriaid', 'El id de la categoria debe ser un número').isNumeric(),
            check('categoriaid').custom( existeCategoria ),
            existeCategoriaEnSoftware(),
            mostrarErrores
        ], softwareController.quitarCategoria);

        router.get('/software/tecnologias', softwareController.obtenerTecnologias);

        router.post('/software/pregunta-custom/:softwareid/:softwarecategoriaid', [
            validarSesion,
            check('softwareid', 'El id del software es requerido').notEmpty(),
            check('softwareid', 'El id del software debe ser un número').isNumeric(),
            softwarePertenece(),
            check('softwarecategoriaid', 'El id de la categoria es requerido').notEmpty(),
            check('softwarecategoriaid', 'El id de la categoria debe ser un número').isNumeric(),
            check('softwarecategoriaid').custom( existeSoftwareCategoria ),
            check('softwarecategoriaid').custom( softwareCategoriaPerteneceSoftware ),
            check('softwarecategoriaid').not().custom( softwareCategoriaTienePregunta ).withMessage('La categoria ya tiene una pregunta custom'),
            check('pregunta', 'La pregunta es requerida').notEmpty(), 
            check('pregunta', 'La pregunta debe tener entre 5 y 100 caracteres').isLength({ min: 5, max: 500 }),
            mostrarErrores
        ], softwareController.agregarPreguntaCustom);

        router.put('/software/pregunta-custom/:preguntaid', [
            validarSesion,
            check('preguntaid', 'El id de la pregunta custom es requerido').notEmpty(),
            check('preguntaid', 'El id de la pregunta custom debe ser un número').isNumeric(),
            check('preguntaid').custom( existePreguntaCustom ),
            check('pregunta', 'La pregunta debe tener entre 5 y 100 caracteres').optional().isLength({ min: 5, max: 500 }),
            mostrarErrores
        ], softwareController.editarPreguntaCustom);

        router.delete('/software/pregunta-custom/:preguntaid', [
            validarSesion,
            check('preguntaid', 'El id de la pregunta custom es requerido').notEmpty(),
            check('preguntaid', 'El id de la pregunta custom debe ser un número').isNumeric(),
            check('preguntaid').custom( existePreguntaCustom ),
            mostrarErrores
        ], softwareController.eliminarPreguntaCustom);

        return router;
    }
}