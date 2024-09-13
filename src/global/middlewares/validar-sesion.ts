import { NextFunction, Request, Response } from "express";
import { JWTService } from "../services/jwt";
import { DatabaseConnectionService } from "../services/database-connection";

export function validarSesion(req: Request, res: Response, next: NextFunction) {
    next();
}