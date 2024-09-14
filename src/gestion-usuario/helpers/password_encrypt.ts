import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export class PasswordEncrypt {

    public static hashPassword(password: string): string {
        const salt = genSaltSync();
        const passwordHash = hashSync(password, salt);
        return passwordHash;
    }

    public static comparePassword(password: string, hash: string): boolean {
        return compareSync(password, hash);
    }
}