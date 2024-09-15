import { DatabaseConnectionService } from "../../global/services/database-connection";
import { Usuario } from "../../models/usuario";

export async function noExisteUsuarioByCorreo(correo: string): Promise<boolean> {
    const dataSource = DatabaseConnectionService.connection;
    const usuario = await dataSource.getRepository(Usuario).findOneBy({correo});
    if(usuario) {
        throw new Error(`El usuario con correo ${correo} ya existe`);
    }
    return true;
}