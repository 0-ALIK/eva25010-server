import { Request, Response } from "express";
import { DatabaseConnectionService } from "../../global/services/database-connection";
import { FileUploadService } from "../../global/services/file-upload";
import { Software } from "../../models/software";
import { ImagenPreview } from "../../models/imagen_preview";
import { SoftwareCategoria } from "../../models/software_categoria";
import { PreguntaCustom } from "../../models/pregunta_custom";
import { Licencia } from "../../models/licencia";
import { TipoSoftware } from "../../models/tipo_software";
import { SubtipoSoftware } from "../../models/subtipo_software";
import { Tecnologia } from "../../models/tecnologia";
import { SoftwareTecnologia } from "../../models/software_tecnologia";
import { In, Like } from "typeorm";

export class SoftwareController {

    public async obtener(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { search, tipo, licencia } = req.query;

        let where: any = {};

        if(search) {
            where.nombre = Like(`%${search}%`);
        }

        if(tipo) {
            where.subtipoSoftware = {
                tipoSoftware: {
                    id: Number(tipo)
                }
            }
        }

        if(licencia) {
            where.licencia = {
                id: Number(licencia)
            }
        }

        try {
            const software = await dataSource.getRepository(Software).find({
                where,
                relations: {
                    subtipoSoftware: true,
                    licencia: true,
                    usuario: {
                        profesion: true,
                    }
                }
            });

            res.status(200).json(software);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener publicaciones' });
        }
    }

    public async obtenerById(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid } = req.params;

        try {
            const software = await dataSource.getRepository(Software).findOne({
                where: {
                    id: Number(softwareid),
                },
                relations: {
                    subtipoSoftware: { tipoSoftware: true },
                    licencia: true,
                    imagenesPreview: true,
                    categorias: {
                        categoria: true,
                        preguntaCustom: true
                    },
                    evaluaciones: {
                        usuario: true,
                        comentario: true,
                    },
                    softwareTecnologias: {
                        tecnologia: true,
                    },
                    usuario: {
                        profesion: true,
                    }
                }
            });

            if(software) {
                software.evaluaciones = software.evaluaciones.slice(0, 5);
            }

            res.status(200).json(software);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener publicacion por id' });
        }
    }

    public async crear(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { nombre, descripcion, version, subtipoSoftware, licencia, portada, imagenesPreview, categorias, tecnologias, usuarioAuth } = req.body;

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

                const tecnologiasPromises = tecnologias.map(async (tecnologia: any) => {
                    await transaction.getRepository(SoftwareTecnologia).save({
                        software: { id: software.id },
                        tecnologia: { id: tecnologia.id }
                    });
                });

                await Promise.all(tecnologiasPromises);

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
        const { nombre, descripcion, version, subtipoSoftware, licencia, currentSoftware, tecnologias } = req.body;

        try {

            await dataSource.transaction(async (transaction) => {
                await transaction.getRepository(Software).update(softwareid, {
                    nombre: nombre || currentSoftware.nombre,
                    descripcion: descripcion || currentSoftware.descripcion,
                    version: version || currentSoftware.version,
                    subtipoSoftware: { id: subtipoSoftware || currentSoftware.subtipoSoftware?.id },
                    licencia: { id: licencia || currentSoftware.licencia?.id },
                });

                const tecnologiasActuales = (currentSoftware as Software).softwareTecnologias.map(st => st.tecnologia.id);
                const tecnologiasNuevas = tecnologias.map((t: any) => t.id);

                const tecnologiasEliminar = tecnologiasActuales.filter(ta => !tecnologiasNuevas.includes(ta));
                const tecnologiasAgregar = tecnologiasNuevas.filter((tn: any) => !tecnologiasActuales.includes(tn));

                await transaction.getRepository(SoftwareTecnologia).delete({
                    software: { id: Number(softwareid) },
                    tecnologia: { id: In(tecnologiasEliminar) }
                });

                const tecnologiasAgregarPromises = tecnologiasAgregar.map(async (tn: any) => {
                    await transaction.getRepository(SoftwareTecnologia).save({
                        software: { id: Number(softwareid) },
                        tecnologia: { id: tn }
                    });
                });

                await Promise.all(tecnologiasAgregarPromises);
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

    public async obtenerTipos(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
    
        try {
            const tipos = await dataSource.getRepository(TipoSoftware).find();
            res.status(200).json(tipos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener tipos de software' });
        }
    }

    public async obtenerSubtipos(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { tipoid } = req.params;

        try {
            const subtipos = await dataSource.getRepository(SubtipoSoftware).find({
                where: {
                    tipoSoftware: { id: Number(tipoid) }
                }
            });

            res.status(200).json(subtipos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener subtipos de software' });
        }
    }

    public async obtenerSoftwarePropio(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { usuarioAuth } = req.body;

        try {
            const software = await dataSource.getRepository(Software).find({
                where: {
                    usuario: { id: usuarioAuth.id }
                },
                relations: {
                    subtipoSoftware: true,
                    licencia: true,
                }
            });

            res.status(200).json(software);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener software propio' });
        }
    }

    public async obtenerSoftwarePropiosById(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid } = req.params;

        try {
            const software = await dataSource.getRepository(Software).findOne({
                where: {
                    id: Number(softwareid)
                },
                relations: {
                    subtipoSoftware: { tipoSoftware: true },
                    licencia: true,
                    imagenesPreview: true,
                    categorias: {
                        categoria: true,
                        preguntaCustom: true
                    }
                }
            });

            res.status(200).json(software);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener software propio por id' });
        }
    }

    public async editarPortada(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid } = req.params;
        const { portada, currentSoftware } = req.body;

        try {
            console.log(currentSoftware);
            
            if(currentSoftware.portada) {
                const deleteResult = await FileUploadService.delete(currentSoftware.portada);

                if(!deleteResult.correct) {
                    throw new Error('Error al eliminar la foto de portada');
                }
            }

            const uploadResult = await FileUploadService.upload(portada);

            if(!uploadResult.correct) {
                throw new Error('Error al subir la foto de portada');
            }

            await dataSource.getRepository(Software).update(softwareid, {
                portada: uploadResult.url
            });

            res.status(200).json({ msg: 'Portada editada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al editar la portada' });
        }
    }

    public async agregarImagenPreview(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid } = req.params;
        const { imagenPreview } = req.body;

        try {
            const uploadResult = await FileUploadService.upload(imagenPreview);

            if(!uploadResult.correct) {
                throw new Error('Error al subir la imagen preview');
            }

            await dataSource.getRepository(ImagenPreview).save({
                imagen: uploadResult.url,
                software: { id: Number(softwareid) }                
            });

            res.status(201).json({ msg: 'Imagen preview agregada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al agregar una imagen preview' });
        }
    }

    public async eliminarImagenPreview(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid, imagenid } = req.params;

        try {
            const imagenPreview = await dataSource.getRepository(ImagenPreview).findOne({
                where: {
                    id: Number(imagenid),
                    software: { id: Number(softwareid) }
                }
            });

            if(!imagenPreview) {
                res.status(404).json({ msg: 'Imagen preview no encontrada' });
                return;
            }

            const deleteResult = await FileUploadService.delete(imagenPreview.imagen);

            if(!deleteResult.correct) {
                throw new Error('Error al eliminar la imagen preview');
            }

            await dataSource.getRepository(ImagenPreview).delete(imagenid);

            res.status(200).json({ msg: 'Imagen preview eliminada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar una imagen preview' });
        }
    }

    public async agregarCategoria(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid, categoriaid } = req.params;

        try {
            await dataSource.getRepository(SoftwareCategoria).save({
                software: { id: Number(softwareid) },
                categoria: { id: categoriaid }
            });

            res.status(201).json({ msg: 'Categoria agregada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al agregar una categoria' });
        }
    }

    public async quitarCategoria(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwareid, categoriaid } = req.params;

        try {
            await dataSource.getRepository(SoftwareCategoria).delete({
                software: { id: Number(softwareid) },
                categoria: { id: categoriaid }
            });

            res.status(200).json({ msg: 'Categoria eliminada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar una categoria' });
        }
    }

    public async obtenerTecnologias(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;

        try {
            const tecnologias = await dataSource.getRepository(Tecnologia).find();

            res.status(200).json(tecnologias);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener tecnologias' });
        }
    }

    public async agregarPreguntaCustom(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { softwarecategoriaid } = req.params;
        const { pregunta } = req.body;

        try {
            await dataSource.getRepository(PreguntaCustom).save({
                softwareCategoria: { id: Number(softwarecategoriaid) },
                descripcion: pregunta
            });

            res.status(201).json({ msg: 'Pregunta custom agregada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al agregar una pregunta custom' });
        }
    }

    public async editarPreguntaCustom(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection;
        const { preguntaid } = req.params;
        const { pregunta } = req.body;

        try {
            await dataSource.getRepository(PreguntaCustom).update(preguntaid, {
                descripcion: pregunta
            });

            res.status(200).json({ msg: 'Pregunta custom editada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al editar una pregunta custom' });
        }
    }

    public async eliminarPreguntaCustom(req: Request, res: Response): Promise<void> {
        const dataSource = DatabaseConnectionService.connection; 
        const { preguntaid } = req.params;

        try {
            await dataSource.getRepository(PreguntaCustom).delete(preguntaid);

            res.status(200).json({ msg: 'Pregunta custom eliminada con éxito' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar una pregunta custom' });
        }
    }

}