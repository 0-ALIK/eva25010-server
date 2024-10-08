import { sign, verify } from 'jsonwebtoken'

const jwt_secret: string = process.env.JWT_SECRET || 'secret';

/**
 * Clase servicio que se encarga de generar tokens JWT
 */
export class JWTService {

    /**
     * Este metodo genera un token con el payload que se le pase
     * @param payload
     * @param duration 
     * @returns el token generado
     */
    public static generarToken( payload: any, duration: string = '24h'): Promise<string|undefined> {        
        return new Promise<string|undefined>((resolve) => {
            sign(payload, jwt_secret, { expiresIn: duration}, (err, token) => {
                if (err) {
                    resolve(undefined);
                } 

                resolve(token);
            });
        });   
    }

    /**
     * Este metodo valida un token
     * @param token 
     * @returns el payload del token si es valido, en caso contrario null
     */
    public static validarToken(token: string) {
        return new Promise((resolve) => {
            verify(token, jwt_secret, (err, decoded) => {
                if (err) {
                    resolve(null);
                }

                resolve(decoded);
            })
        });
    }
}

