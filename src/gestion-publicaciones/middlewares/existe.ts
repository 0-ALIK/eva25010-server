import { Request, Response, NextFunction } from 'express';
import { DatabaseConnectionService } from '../../global/services/database-connection';
import { SoftwareCategoria } from '../../models/software_categoria';
import { PreguntaCustom } from '../../models/pregunta_custom';

export function existeCategoriaEnSoftware(debeExistir: boolean = true) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid, categoriaid } = req.params;
        
        try {
            const softwareCategoria = await dataSource.getRepository(SoftwareCategoria).findOne({
                where: {
                    software: { id: Number(softwareid) },
                    categoria: {id: categoriaid }
                }
            });

            if (debeExistir && !softwareCategoria) {
                return res.status(404).json({ msg: 'No existe la categoria en el software' });
            } else if (!debeExistir && softwareCategoria) {
                return res.status(400).json({ msg: 'La categoria ya existe en el software' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error' });
        }
    };
}

/**
 * @deprecated
 */
export function existePreguntaCustomEnCategoria(debeExistir: boolean = true) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid, softwarecategoriaid, preguntaid } = req.params;
        
        try {
            let where: any = {};

            if(preguntaid) {
                where = { id: preguntaid };
            } else {
                where = {
                    softwareCategoria: { id: Number(softwarecategoriaid) },
                };
            }

            const preguntaCustom = await dataSource.getRepository(PreguntaCustom).findOne({where});

            if(debeExistir && !preguntaCustom) {
                return res.status(404).json({ msg: 'No existe la pregunta custom en la categoria' });
            } else if (!debeExistir && preguntaCustom) {
                return res.status(400).json({ msg: 'La pregunta custom ya existe en la categoria' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error' });
        }
    };
}
