import { Request, Response, NextFunction } from 'express';
import { DatabaseConnectionService } from '../../global/services/database-connection';
import { Software } from '../../models/software';

export function softwarePertenece(pertenece: boolean = true) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid } = req.params;
        const { usuarioAuth } = req.body;

        try {
            const software = await dataSource.getRepository(Software).findOne({
                where: {
                    id: Number(softwareid),
                    usuario: { id: usuarioAuth.id }
                },
                relations: {
                    licencia: true,
                    subtipoSoftware: true,
                    usuario: true,
                }
            });

            req.body.currentSoftware = software;

            if(pertenece && !software) {
                return res.status(404).json({ error: 'Software no encontrado' });
            }

            if(!pertenece && software) {
                return res.status(400).json({ error: 'El software ya existe' });
            }

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al validar si el software pertenece al usuario' });
        }
    };
    
}