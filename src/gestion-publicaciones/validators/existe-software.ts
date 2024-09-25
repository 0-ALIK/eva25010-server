import { DatabaseConnectionService } from "../../global/services/database-connection";
import { Categoria } from "../../models/categoria";
import { Licencia } from "../../models/licencia";
import { SubtipoSoftware } from "../../models/subtipo_software";
import { TipoSoftware } from "../../models/tipo_software";

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