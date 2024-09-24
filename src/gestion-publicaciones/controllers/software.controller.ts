import { Request, Response } from "express";
import { DatabaseConnectionService } from "../../global/services/database-connection";
import { FileUploadService } from "../../global/services/file-upload";
import { Software } from "../../models/software";
import { ImagenPreview } from "../../models/imagen_preview";
import { SoftwareCategoria } from "../../models/software_categoria";
import { PreguntaCustom } from "../../models/pregunta_custom";
import { Licencia } from "../../models/licencia";

export class SoftwareController {

    public async crear(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { nombre, descripcion, version, subtipoSoftware, licencia, portada, imagenesPreview, categorias, usuarioAuth } = req.body;

        try {
            
            await dataSource.transaction(async (transaction) => {
                const uploadResult = await FileUploadService.upload(portada);
                
                if(!uploadResult.correct) {
                    throw new Error('Error al subir la foto de portada');
                }

                const software = await transaction.getRepository(Software).save({
                    nombre,
                    descripcion,
                    version,
                    portada: uploadResult.url,
                    usuario: { id: usuarioAuth.id },
                    subtipoSoftware: { id: subtipoSoftware },
                    licencia: { id: licencia },
                });

                const imagenesPreviewPromises = imagenesPreview.map(async (imagen: any) => {
                    const uploadResult = await FileUploadService.upload(imagen);

                    if(!uploadResult.correct) {
                        throw new Error('Error al subir imagenes preview');
                    }

                    await transaction.getRepository(ImagenPreview).save({
                        software: { id: software.id },
                        imagen: uploadResult.url
                    });
                });

                await Promise.all(imagenesPreviewPromises);

                const categoriasPromises = categorias.map(async (categoria: any) => {
                    const softwareCategoria = await transaction.getRepository(SoftwareCategoria).save({
                        software: { id: software.id },
                        categoria: { id: categoria.categoria },
                    });

                    if(categoria.pregunta) {
                        await transaction.getRepository(PreguntaCustom).save({
                            softwareCategoria: { id: softwareCategoria.id },
                            descripcion: categoria.pregunta
                        });
                    }
                });

                await Promise.all(categoriasPromises);
            });

            res.status(201).json({ msg: 'Publicación creada con éxito' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al crear una publicacion' });
        }
    }

    public async editar(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid } = req.params;
        const { nombre, descripcion, version, subtipoSoftware, licencia, currentSoftware } = req.body;

        try {
            await dataSource.getRepository(Software).update(softwareid, {
                nombre: nombre || currentSoftware.nombre,
                descripcion: descripcion || currentSoftware.descripcion,
                version: version || currentSoftware.version,
                subtipoSoftware: { id: subtipoSoftware || currentSoftware.subtipoSoftware?.id },
                licencia: { id: licencia || currentSoftware.licencia?.id },
            });

            res.status(200).json({ msg: 'Publicación editada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al editar una publicacion' });
        }
    }

    public async obtenerLicencias(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;

        try {
            const licencias = await dataSource.getRepository(Licencia).find();
            res.status(200).json(licencias);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener licencias' });
        }
    }

    public async obtenerSoftwarePropio(req: Request, res: Response): Promise<void> {}

    public async obtenerSoftwarePropioById(req: Request, res: Response): Promise<void> {}
}