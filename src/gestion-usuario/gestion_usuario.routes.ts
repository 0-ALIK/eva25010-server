import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";
import { check } from "express-validator";
import { mostrarErrores } from "../global/middlewares/mostrar-errores";
import { noExisteUsuarioByCorreo } from "./validators/existe-usuario";
import { UsuariosController } from "./controllers/usuarios.controller";
import { existeProfesion } from "./validators/existe-profesion";
import { validarSesion } from "../global/middlewares/validar-sesion";
import { filesToBody } from "../global/middlewares/files";
import { imagenExtensiones, validarExtension } from "../global/validators/validar-extension";

export class GestionUsuarioRoutes {

    public static get routes(): Router {
        const router = Router();

        const authController = new AuthController();
        const usuarioController = new UsuariosController();

        router.post('/auth/login', [
            check('correo', 'El correo es obligatorio').notEmpty(),
            check('password', 'La contraseña es obligatoria').notEmpty(),
            mostrarErrores
        ], authController.login);

        router.get('/auth/verify', validarSesion, authController.verify);

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

        router.put('/usuarios', [
            validarSesion,
            check('nombre', 'El nombre es obligatorio').optional().notEmpty(),
            check('nombre', 'El nombre debe tener al menos 2 caracteres y maximo 100').optional().isLength({min: 2, max: 100}),
            check('apellido', 'El apellido es obligatorio').optional().notEmpty(),
            check('apellido', 'El apellido debe tener al menos 2 caracteres y maximo 100').optional().isLength({min: 2, max: 100}),
            check('cargo', 'El cargo debe tener al menos 2 caracteres y maximo 100').optional().isLength({min: 2, max: 100}),
            check('profesionId', 'La profesión es obligatoria').optional().notEmpty(),
            check('profesionId', 'La profesión debe ser un número').optional().isNumeric(),
            check('profesionId').custom(existeProfesion),
            mostrarErrores
        ], usuarioController.update);

        router.get('/usuarios', [
            
        ], usuarioController.obtener);

        router.post('/usuarios/foto', [
            validarSesion,
            filesToBody,
            check('foto', 'La foto es obligatoria').notEmpty(),
            check('foto', 'La foto debe ser un archivo').isObject(),
            check('foto', 'La foto debe ser una imagen').custom((value) => validarExtension(value, [
                ...imagenExtensiones
            ])),
            mostrarErrores
        ], usuarioController.subirFoto);

        router.get('/usuarios/profesiones', usuarioController.getProfesiones);

        return router
    }
}