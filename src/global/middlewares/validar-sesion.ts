import { NextFunction, Request, Response } from "express";
import { JWTService } from "../services/jwt";
import { DatabaseConnectionService } from "../services/database-connection";
import { Usuario } from "../../models/usuario";

export async function validarSesion(req: Request, res: Response, next: NextFunction) {
    const dataSource = DatabaseConnectionService.connection;
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).send({msg: 'No se proporciono un token'});
    }

    try {
        const payload: any = await JWTService.validarToken(token);

        if (!payload) {
            return res.status(401).send({msg: 'Token invalido'});
        }

        const usuario = await dataSource.getRepository(Usuario).findOneBy({id: payload.id});

        if (!usuario) {
            return res.status(401).send({msg: 'Usuario no encontrado'});
        }

        req.body.usuarioAuth = usuario;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send({msg: 'Error al validar la sesion'});    
    }
}