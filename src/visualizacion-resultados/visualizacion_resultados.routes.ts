import { Router } from "express";
import { ResultadosController } from "./controllers/resultados.controller";
import { validarSesion } from "../global/middlewares/validar-sesion";
import { mostrarErrores } from "../global/middlewares/mostrar-errores";
import { check } from "express-validator";
import { softwarePertenece } from "../gestion-publicaciones/middlewares/pertenece";
import { existePreguntaCustom } from "../gestion-publicaciones/validators/existe-software";

export class VisualizacionResultadosRoutes {
    
    public static get routes(): Router {
        const router = Router();

        const resultadosController = new ResultadosController();

        router.get('/resultados/total-evaluaciones/:softwareid', [
            validarSesion,
            check('softwareid', 'El softwareid es obligatorio').notEmpty(),
            check('softwareid', 'El softwareid debe ser un número').isNumeric(),
            softwarePertenece(),
            mostrarErrores
        ], resultadosController.obtenerTotalEvaluaciones);

        router.get('/resultados/promedio-final/:softwareid', [
            validarSesion,
            check('softwareid', 'El softwareid es obligatorio').notEmpty(),
            check('softwareid', 'El softwareid debe ser un número').isNumeric(),
            softwarePertenece(),
            mostrarErrores
        ], );

        router.get('/resultados/preguntas/total/:softwareid/:preguntaid', [
            validarSesion,
            check('softwareid', 'El softwareid es obligatorio').notEmpty(),
            check('softwareid', 'El softwareid debe ser un número').isNumeric(),
            softwarePertenece(),
            check('preguntaid', 'El preguntaid es obligatorio').notEmpty(),
            check('preguntaid', 'El preguntaid debe ser un número').isNumeric(),
            check('preguntaid').custom( existePreguntaCustom ),
            mostrarErrores
        ], );

        return router;
    }
}