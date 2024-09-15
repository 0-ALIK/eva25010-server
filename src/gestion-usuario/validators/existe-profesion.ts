import { DatabaseConnectionService } from "../../global/services/database-connection";
import { Profesion } from "../../models/profesion";

export async function existeProfesion(id: number): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;
    const profesion = await dataSource.getRepository(Profesion).findOneBy({id})
    if (!profesion) {
        throw new Error('La profesión no existe')
    }
    return true;
}