import { Router } from "express";
import { GestionUsuarioRoutes } from "./gestion-usuario/gestion_usuario.routes";

export class Routes {

    public static get routes(): Router {
        const router = Router();

        router.use('/api/gestion-usuario', GestionUsuarioRoutes.routes);

        return router;
    }
}