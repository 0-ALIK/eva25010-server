import { Request, Response } from "express";
import { DatabaseConnectionService } from "../../global/services/database-connection";
import { Evaluacion } from "../../models/evaluacion";

export class ResultadosController {

    public async obtenerTotalEvaluaciones(req: Request, res: Response) {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid } = req.params;

        try {
            const evaluaciones = await dataSource.getRepository(Evaluacion).find({
                where: { 
                    software: { id: Number(softwareid) }
                },
                relations: {
                    usuario: true,
                    comentario: true,
                }
            });

            res.status(200).json(evaluaciones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener el total de evaluaciones' });
        }
    }

    public async obtenerPromedioFinal(req: Request, res: Response) {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid } = req.params;

        try {

            const evaluaciones = await dataSource.getRepository(Evaluacion).find({
                where: { 
                    software: { id: Number(softwareid) }
                },
                relations: {
                    respuestas: {
                        pregunta: true
                    }
                }
            });


        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener el promedio final' });
        }
    }
}