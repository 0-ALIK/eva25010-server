import { Request, Response } from 'express';
import { DatabaseConnectionService } from '../../global/services/database-connection';
import { Categoria } from '../../models/categoria';
import { Subcategoria } from '../../models/subcategoria';
import { Pregunta } from '../../models/pregunta';
import { Respuesta } from '../../models/respuesta';
import { Evaluacion } from '../../models/evaluacion';
import { RespuestaCustom } from '../../models/respuesta_custom';
import { PreguntaCustom } from '../../models/pregunta_custom';

export class EvaluacionesController {

    public async obtenerCategorias(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;

        try {
            const categorias = await dataSource.getRepository(Categoria).find();
            res.json(categorias);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener las categorias' });
        }
    }

    public async obtenerSubcategorias(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { categoriaid } = req.params;

        try {
            const subcategorias = await dataSource.getRepository(Subcategoria).find({ 
                where: {
                    categoria: { id: categoriaid }
                } 
            });
            
            res.json(subcategorias);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener las subcategorias' });
        }
    }

    public async obtenerPreguntas(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { subcategoriaid } = req.params;

        try {
            const preguntas = await dataSource.getRepository(Pregunta).find({
                where: {
                    subcategoria: { id: subcategoriaid }
                }
            });

            res.status(200).json(preguntas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener las preguntas' });
        }
    }

    public async evaluar(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { respuestas, respuestasCustom, usuarioAuth } = req.body;
        const { softwareid } = req.params;

        try {
            await dataSource.transaction(async transaction => {

                const evaluacion = await transaction.getRepository(Evaluacion).save({
                    usuario: { id: Number(usuarioAuth.id) },
                    software: { id: Number(softwareid) },
                });

                await transaction.getRepository(Respuesta).save(Object.entries(respuestas).map(([preguntaid, valor]) => {
                    const respuesta = transaction.getRepository(Respuesta).create({
                        pregunta: { id: Number(preguntaid) },
                        valor: Number(valor),
                        evaluacion: { id: evaluacion.id }
                    });
                    return respuesta;
                }));

                await transaction.getRepository(RespuestaCustom).save(Object.entries(respuestasCustom).map(([preguntaid, valor]) => {
                    const respuestaCustom = transaction.getRepository(RespuestaCustom).create({
                        pregunta: { id: Number(preguntaid) },
                        valor: Number(valor),
                        evaluacion: { id: evaluacion.id }
                    });
                    return respuestaCustom;
                }));

            }); 

            res.status(200).json({ msg: 'Evaluación guardada correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al guardar la evaluación' });
        }
    }

    public async obtenerEvaluacionesPropias(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { usuarioAuth } = req.body;

        try {
            const evaluaciones = await dataSource.getRepository(Evaluacion).find({
                where: {
                    usuario: { id: usuarioAuth.id }
                },
                relations: {
                    software: {
                        usuario: true,
                    },
                }
            });

            res.json(evaluaciones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener las evaluaciones' });
        }
    }

    public async obtenerPreguntasCustom(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid } = req.params;

        try {
            const preguntas = await dataSource.getRepository(PreguntaCustom).find({
                where: {
                    softwareCategoria: {
                        software: { id: Number(softwareid) }
                    }
                },
                relations: {
                    softwareCategoria: {
                        categoria: true
                    }
                }
            }); 

            res.json(preguntas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener las preguntas custom' });
        }
    }

}