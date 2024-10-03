import { Meta } from "express-validator";
import { DatabaseConnectionService } from "../../global/services/database-connection";
import { Categoria } from "../../models/categoria";
import { Licencia } from "../../models/licencia";
import { SoftwareCategoria } from "../../models/software_categoria";
import { SubtipoSoftware } from "../../models/subtipo_software";
import { Tecnologia } from "../../models/tecnologia";
import { TipoSoftware } from "../../models/tipo_software";
import { PreguntaCustom } from "../../models/pregunta_custom";
import { Pregunta } from "../../models/pregunta";

export async function existeLicencia(id: number): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;
    const licencia = await dataSource.getRepository(Licencia).findOneBy({id});
    if(!licencia) {
        throw new Error(`La licencia con id ${id} no existe`);
    }
    return true;
}

export async function existeTipoSoftware(id: number): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;
    const tipoSoftware = await dataSource.getRepository(TipoSoftware).findOneBy({id});
    if(!tipoSoftware) {
        throw new Error(`El tipo de software con id ${id} no existe`);
    }
    return true;
}

export async function existeSubtipoSoftware(id: number): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;
    const subtipoSoftware = await dataSource.getRepository(SubtipoSoftware).findOneBy({id});
    if(!subtipoSoftware) {
        throw new Error(`El subtipo de software con id ${id} no existe`);
    }
    return true;
}

export async function existeCategoria(id: string): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;
    const categoria = await dataSource.getRepository(Categoria).findOneBy({id});
    if(!categoria) {
        throw new Error(`La categoria con id ${id} no existe`);
    }
    return true;
}

export async function existeSoftwareCategoria(id: number): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;
    const softwareCategoria = await dataSource.getRepository(SoftwareCategoria).findOneBy({id});
    if(!softwareCategoria) {
        throw new Error(`La categoria de software con id ${id} no existe`);
    }
    return true;
}

export async function softwareCategoriaPerteneceSoftware(id: number, meta: Meta): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;

    if(!meta.req.params) {
        throw new Error('No se encontraron parametros en la peticion');
    }

    const { softwareid } = meta.req.params;
    
    const softwareCategoria = await dataSource.getRepository(SoftwareCategoria).findOne({
        where: { id },
        relations: { software: true }
    });

    if(!softwareCategoria) {
        throw new Error(`La categoria de software con id ${id} no existe`);
    }

    if(softwareCategoria.software.id !== Number(softwareid)) {
        throw new Error(`La categoria de software con id ${id} no pertenece al software con id ${softwareid}`);
    }

    return true;
}

export async function softwareCategoriaTienePregunta(id: number): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;

    const softwareCategoria = await dataSource.getRepository(SoftwareCategoria).findOne({
        where: { id },
        relations: { preguntaCustom: true }
    });

    if(!softwareCategoria) {
        throw new Error(`La categoria de software con id ${id} no existe`);
    }

    if(!softwareCategoria.preguntaCustom) {
        throw new Error(`La categoria de software con id ${id} no tiene una pregunta asociada`);
    }

    return true;
}

export async function existePreguntaCustom(id: number, meta: Meta): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;

    if(!meta.req.body) {
        throw new Error('No se encontraron parametros en la peticion');
    }

    const { usuarioAuth } = meta.req.body;

    const preguntaCustom = await dataSource.getRepository(PreguntaCustom).findOne({
        where: { id },
        relations: { 
            softwareCategoria: {
                software: {
                    usuario: true
                }
            }
        }
    });

    if(!preguntaCustom) {
        throw new Error(`La pregunta con id ${id} no existe`);
    }

    if(preguntaCustom.softwareCategoria.software.usuario.id !== usuarioAuth.id) {
        throw new Error(`La pregunta con id ${id} no pertenece al usuario autenticado`);
    }
    
    return true;
}

export async function existePregunta(id: number, meta: Meta): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;

    if(!meta.req.body) {
        throw new Error('No se encontraron parametros en la peticion');
    }

    const { usuarioAuth } = meta.req.body;

    const pregunta = await dataSource.getRepository(Pregunta).findOne({
        where: { id },
        relations: { 
            subcategoria: {
                categoria: {
                    softwareCategorias: {
                        software: {
                            usuario: true
                        }
                    }
                }
            }
        }
    });

    if(!pregunta) {
        throw new Error(`La pregunta con id ${id} no existe`);
    }

    if(pregunta.subcategoria.categoria.softwareCategorias.some(softwareCategoria => softwareCategoria.software.usuario.id === usuarioAuth.id)) {
        return true;
    }
    
    throw new Error(`La pregunta con id ${id} no pertenece al usuario autenticado`);
}

export async function existeTecnologia(id: number): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;
    const tecnologia = await dataSource.getRepository(Tecnologia).findOneBy({id});
    if(!tecnologia) {
        throw new Error(`La tecnologia con id ${id} no existe`);
    }
    return true;
}   