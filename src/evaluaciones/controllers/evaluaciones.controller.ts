import { Request, Response } from 'express';
import { DatabaseConnectionService } from '../../global/services/database-connection';
import { Categoria } from '../../models/categoria';
import { Subcategoria } from '../../models/subcategoria';

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

}