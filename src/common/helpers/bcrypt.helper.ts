// src/common/helpers/bcrypt.helper.ts
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(
    password: string,
    hash: string,
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function hash(str: string): Promise<string> {
    return bcrypt.hash(str, SALT_ROUNDS);
}
