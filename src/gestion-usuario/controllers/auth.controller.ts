import { Request, Response } from "express";
import { DatabaseConnectionService } from "../../global/services/database-connection";
import { Usuario } from "../../models/usuario";
import { PasswordEncrypt } from "../helpers/password_encrypt";
import { JWTService } from "../../global/services/jwt";

export class AuthController {

    public async login(req: Request, res: Response) {
        const dataSource = DatabaseConnectionService.connection;
        const { correo, password } = req.body;

        try {
            const usuario = await dataSource.getRepository(Usuario).findOne({
                where: {
                    correo
                },
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    cargo: true,
                    profesion: {
                        id: true,
                        nombre: true
                    },
                    correo: true,
                    password: true,
                    createdAt: true,
                    updatedAt: true 
                }
            });

            if(!usuario) {
                return res.status(401).json({ msg: 'Correo / contraseña incorrectos' });
            }

            if(!PasswordEncrypt.comparePassword(password, usuario.password)) {
                return res.status(401).json({ msg: 'Correo / contraseña incorrectos' });
            }

            const token = await JWTService.generarToken({ id: usuario.id, correo: usuario.correo });

            if(!token) {
                return res.status(500).json({ msg: 'Error al generar token' });
            }

            delete (usuario as any).password;

            return res.status(200).json({
                usuario,
                token
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error al iniciar sesión' });
        }
    }   

    public async register(req: Request, res: Response) {
        const dataSource = DatabaseConnectionService.connection;
        const { nombre, apellido, correo, password } = req.body;

        try {
            const usuario = await dataSource.getRepository(Usuario).save({
                nombre,
                apellido,
                correo,
                password: PasswordEncrypt.hashPassword(password)
            });

            const token = await JWTService.generarToken({ id: usuario.id, correo: usuario.correo });

            return res.status(201).json({
                usuario,
                token
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error al registrar usuario' });
        }
    }
}