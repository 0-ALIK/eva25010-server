import { Request, Response } from "express";
import { DatabaseConnectionService } from "../../global/services/database-connection";
import { Usuario } from "../../models/usuario";
import { FileUploadService } from "../../global/services/file-upload";
import { Profesion } from "../../models/profesion";

export class UsuariosController {

    public async update(req: Request, res: Response) {
        const dataSource = DatabaseConnectionService.connection;
        const { usuarioAuth, nombre, apellido, cargo, profesionId } = req.body;
        
        try {
            await dataSource.getRepository(Usuario).update(usuarioAuth.id, {
                nombre: nombre || usuarioAuth.nombre,
                apellido: apellido || usuarioAuth.apellido,
                cargo: cargo || usuarioAuth.cargo,
                profesion: {
                    id: profesionId || usuarioAuth.profesion?.id
                }
            });

            return res.status(200).json({ msg: 'Usuario actualizado' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error al actualizar usuario' });
        }
    }

    public async subirFoto(req: Request, res: Response) {
        const dataSource = DatabaseConnectionService.connection;
        const { usuarioAuth, foto } = req.body;

        try {
            if(usuarioAuth.foto) {
                const deleteResult = await FileUploadService.delete(usuarioAuth.foto);
                if(!deleteResult.correct) {
                    return res.status(500).json({ msg: 'Error al subir foto' });
                }
            }

            const uploadResult = await FileUploadService.upload(foto);

            if(!uploadResult.correct) {
                return res.status(500).json({ msg: 'Error al subir foto' });
            }

            await dataSource.getRepository(Usuario).update(usuarioAuth.id, {
                foto: uploadResult.url
            });

            return res.status(200).json({ msg: 'Foto subida' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error al subir foto' });
        }
    }

    public async getProfesiones(req: Request, res: Response) {
        const dataSource = DatabaseConnectionService.connection;

        try {
            const profesiones = await dataSource.getRepository(Profesion).find();
            return res.status(200).json(profesiones);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error al obtener profesiones' });
        }
    }

}