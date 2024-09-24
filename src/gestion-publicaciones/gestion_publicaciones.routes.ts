import { Router } from "express";
import { SoftwareController } from "./controllers/software.controller";
import { validarSesion } from "../global/middlewares/validar-sesion";
import { mostrarErrores } from "../global/middlewares/mostrar-errores";
import { filesToBody } from "../global/middlewares/files";
import { parseJsonCampos } from "../global/middlewares/parse-json-campos";
import { check } from "express-validator";
import { imagenExtensiones, validarExtension } from "../global/validators/validar-extension";
import { existeLicencia, existeSubtipoSoftware } from "./validators/existe-software";
import { softwarePertenece } from "./middlewares/pertenece";

export class GestionPublicacionesRoutes {

    public static get routes(): Router {
        const router = Router();

        const softwareController = new SoftwareController();

        router.post('/software', [
            validarSesion,
            filesToBody,
            parseJsonCampos(['categorias']),
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
            check('categorias.*.pregunta', 'La pregunta es requerida').optional().isString(),
            mostrarErrores
        ], softwareController.crear);

        router.put('/software/:softwareid', [
            validarSesion,
            filesToBody,
            softwarePertenece(),
            check('nombre', 'El nombre debe tener entre 5 y 100 caracteres').optional().isLength({ min: 5, max: 100 }),
            check('descripcion', 'La descripción es requerida').optional().notEmpty(),
            check('version', 'La versión debe tener entre 1 y 20 caracteres').optional().isLength({ min: 1, max: 20 }),
            check('licencia', 'La licencia debe ser un número').optional().isNumeric(),
            check('licencia').optional().custom( existeLicencia ),
            check('subtipoSoftware', 'El subtipo de software debe ser un número').optional().isNumeric(),
            check('subtipoSoftware').optional().custom( existeSubtipoSoftware ),
            mostrarErrores
        ], softwareController.editar);

        router.get('/software/licencias', softwareController.obtenerLicencias);

        return router;
    }
}