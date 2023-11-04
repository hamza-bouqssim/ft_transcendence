/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';

export async function hashfunction(rawPassword : string)
{
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(rawPassword, salt);
}

export async function compareHash(rawPassword: string, hashedPassword : string) {
    return bcrypt.compare(rawPassword, hashedPassword);
}