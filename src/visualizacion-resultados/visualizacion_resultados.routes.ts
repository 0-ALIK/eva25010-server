import { Router } from "express";
import { ResultadosController } from "./controllers/resultados.controller";
import { validarSesion } from "../global/middlewares/validar-sesion";
import { mostrarErrores } from "../global/middlewares/mostrar-errores";
import { check } from "express-validator";
import { softwarePertenece } from "../gestion-publicaciones/middlewares/pertenece";
import { existeCategoria, existePregunta } from "../gestion-publicaciones/validators/existe-software";

export class VisualizacionResultadosRoutes {
    
    public static get routes(): Router {
        const router = Router();

        const resultadosController = new ResultadosController();

        router.get('/total-evaluaciones/:softwareid', [
            validarSesion,
            check('softwareid', 'El softwareid es obligatorio').notEmpty(),
            check('softwareid', 'El softwareid debe ser un número').isNumeric(),
            softwarePertenece(),
            mostrarErrores
        ], resultadosController.obtenerTotalEvaluaciones);

        router.get('/promedio-final/:softwareid', [
            validarSesion,
            check('softwareid', 'El softwareid es obligatorio').notEmpty(),
            check('softwareid', 'El softwareid debe ser un número').isNumeric(),
            softwarePertenece(),
            mostrarErrores
        ], resultadosController.obtenerPromedioFinal);

        router.get('/promedio-final/categoria/:softwareid/:categoriaid', [
            validarSesion,
            check('softwareid', 'El softwareid es obligatorio').notEmpty(),
            check('softwareid', 'El softwareid debe ser un número').isNumeric(),
            softwarePertenece(),
            check('categoriaid', 'El categoriaid es obligatorio').notEmpty(),
            check('categoriaid', 'El categoriaid debe ser un número').isString(),
            check('categoriaid').custom( existeCategoria),
            mostrarErrores
        ], resultadosController.obtenerPromedioFinalCategoria);

        router.get('/promedio-final/subcategoria/:softwareid/:subcategoriaid', [
            validarSesion,
            check('softwareid', 'El softwareid es obligatorio').notEmpty(),
            check('softwareid', 'El softwareid debe ser un número').isNumeric(),
            softwarePertenece(),
            check('subcategoriaid', 'El subcategoriaid es obligatorio').notEmpty(),
            check('subcategoriaid', 'El subcategoriaid debe ser un número').isString(),
            mostrarErrores
        ], resultadosController.obtenerPromedioFinalSubcategoria);

        router.get('/preguntas/total/:softwareid/:preguntaid', [
            validarSesion,
            check('softwareid', 'El softwareid es obligatorio').notEmpty(),
            check('softwareid', 'El softwareid debe ser un número').isNumeric(),
            softwarePertenece(),
            check('preguntaid', 'El preguntaid es obligatorio').notEmpty(),
            check('preguntaid', 'El preguntaid debe ser un número').isNumeric(),
            check('preguntaid').custom( existePregunta ),
            mostrarErrores
        ], resultadosController.obtenerTotalPreguntas);

        return router;
    }
}