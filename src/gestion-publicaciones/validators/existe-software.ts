import { DatabaseConnectionService } from "../../global/services/database-connection";
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