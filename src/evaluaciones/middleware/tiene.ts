import { Request, Response, NextFunction } from 'express';
import { DatabaseConnectionService } from '../../global/services/database-connection';
import { Evaluacion } from '../../models/evaluacion';

export async function yaEvaluado(req: Request, res: Response, next: NextFunction) {
    const dataSource = DatabaseConnectionService.connection;
    const { softwareid } = req.params;
    const { usuarioAuth } = req.body;

    try {
        const evaluacion = await dataSource.getRepository(Evaluacion).findOne({
            where: {
                usuario: { id: usuarioAuth.id },
                software: { id: Number(softwareid) }
            }
        });

        if(evaluacion) {
            return res.status(400).json({ msg: 'Ya has evaluado este software' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al verificar si ya has evaluado este software' });
    }
}