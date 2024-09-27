import { Router } from "express";
import { GestionUsuarioRoutes } from "./gestion-usuario/gestion_usuario.routes";
import { GestionPublicacionesRoutes } from "./gestion-publicaciones/gestion_publicaciones.routes";
import { EvaluacionesRoutes } from "./evaluaciones/evaluaciones.routes";

export class Routes {

    public static get routes(): Router {
        const router = Router();

        router.use('/api/gestion-usuario', GestionUsuarioRoutes.routes);
        router.use('/api/gestion-publicaciones', GestionPublicacionesRoutes.routes);
        router.use('/api/evaluaciones', EvaluacionesRoutes.routes);

        return router;
    }
}