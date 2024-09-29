import { Router } from "express";
import { EvaluacionesController } from "./controllers/evaluaciones.controller";
import { check } from "express-validator";
import { mostrarErrores } from "../global/middlewares/mostrar-errores";

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

        return router;
    }
}