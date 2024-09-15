import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";
import { check } from "express-validator";
import { mostrarErrores } from "../global/middlewares/mostrar-errores";
import { noExisteUsuarioByCorreo } from "./validators/existe-usuario";

export class GestionUsuarioRoutes {

    public static get routes(): Router {
        const router = Router();

        const authController = new AuthController();

        router.post('/auth/login', [
            check('correo', 'El correo es obligatorio').notEmpty(),
            check('password', 'La contraseña es obligatoria').notEmpty(),
            mostrarErrores
        ], authController.login);

        router.post('/auth/register', [
            check('nombre', 'El nombre es obligatorio').notEmpty(),
            check('nombre', 'El nombre debe tener al menos 2 caracteres y maximo 100').isLength({min: 2, max: 100}),
            check('apellido', 'El apellido es obligatorio').notEmpty(),
            check('apellido', 'El apellido debe tener al menos 2 caracteres y maximo 100').isLength({min: 2, max: 100}),
            check('correo', 'El correo es obligatorio').notEmpty(),
            check('correo', 'El correo no es válido').isEmail(),
            check('correo').custom(noExisteUsuarioByCorreo),
            check('password', 'La contraseña es obligatoria').notEmpty(),
            check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
            mostrarErrores
        ], authController.register);


        return router
    }
}