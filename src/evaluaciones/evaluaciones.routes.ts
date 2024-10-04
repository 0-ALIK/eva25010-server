import { Router } from "express";
import { EvaluacionesController } from "./controllers/evaluaciones.controller";
import { check } from "express-validator";
import { mostrarErrores } from "../global/middlewares/mostrar-errores";
import { validarSesion } from "../global/middlewares/validar-sesion";
import { softwarePertenece } from "../gestion-publicaciones/middlewares/pertenece";

export class EvaluacionesRoutes {

    public static get routes(): Router {
        const router = Router();

        const evaluacionesController = new EvaluacionesController();

        router.get('/categorias', evaluacionesController.obtenerCategorias);

        router.get('/subcategorias/:categoriaid', [
            check('categoriaid', 'El id de la categoria es obligatorio').not().isEmpty(),
            mostrarErrores
        ],evaluacionesController.obtenerSubcategorias);

        router.get('/preguntas/:subcategoriaid', [
            check('subcategoriaid', 'El id de la subcategoria es obligatorio').not().isEmpty(),
            mostrarErrores
        ], evaluacionesController.obtenerPreguntas);

        router.get('/preguntas-custom/:softwareid', [
            check('softwareid', 'El id del software es obligatorio').not().isEmpty(),
            check('softwareid', 'El id del software debe ser un número').isNumeric(),
            mostrarErrores
        ], evaluacionesController.obtenerPreguntasCustom)

        router.get('/propias', [
            validarSesion,
            mostrarErrores
        ], evaluacionesController.obtenerEvaluacionesPropias);

        router.post('/evaluar/:softwareid', [
            validarSesion,
            check('softwareid', 'El id del software es obligatorio').not().isEmpty(),
            check('softwareid', 'El id del software debe ser un número').isNumeric(),
            softwarePertenece(false),
            check('respuestas', 'Las respuestas son obligatorias').notEmpty(),
            check('respuestas', 'Respuestas deber ser un objeto').isObject(),
            check('respuestas.*', 'Las respuestas deben ser un número').isNumeric(),
            check('respuestasCustom', 'Las respuestas custom son obligatorias').notEmpty(),
            check('respuestasCustom', 'Respuestas custom deber ser un objeto').isObject(),
            check('respuestasCustom.*', 'Las respuestas custom deben ser un objeto').isObject(),
            mostrarErrores
        ], evaluacionesController.evaluar);

        return router;
    }
}