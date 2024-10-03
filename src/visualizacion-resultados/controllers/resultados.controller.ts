import { Request, Response } from "express";
import { DatabaseConnectionService } from "../../global/services/database-connection";
import { Evaluacion } from "../../models/evaluacion";
import { Promedio } from "../helpers/promedio";
import { Respuesta } from "../../models/respuesta";

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
                        pregunta: {
                            subcategoria: {
                                categoria: true
                            }
                        }
                    }
                }
            });

            const promedios = evaluaciones.map(evaluacion => {
                return Promedio.calcularPromedio(evaluacion);
            });

            const sumaPromedios = promedios.reduce((acc, promedio) => acc + promedio, 0);

            const promedioFinal = sumaPromedios / promedios.length;

            res.status(200).json({ promedioFinal });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener el promedio final' });
        }
    }

    public async obtenerTotalPreguntas(req: Request, res: Response) {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid, preguntaid } = req.params;

        try {
            const respuestas = await dataSource.getRepository(Respuesta).find({
                where: {
                    pregunta: { id: Number(preguntaid) },
                    evaluacion: {
                        software: { id: Number(softwareid) }
                    }
                }
            });

            const agrupaciones: any = {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0
            };

            respuestas.forEach(respuesta => {
                agrupaciones[respuesta.valor.toString()]++;
            });

            res.status(200).json(agrupaciones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener el total de preguntas' });
        }
    }
}