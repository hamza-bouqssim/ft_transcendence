import { IsAlphanumeric, IsNotEmpty, IsOptional } from "class-validator";

export class ftAndGoogleTfaDto {
    @IsAlphanumeric()
    @IsNotEmpty()
    code: string
}