/* eslint-disable prettier/prettier */
import {  IsAlphanumeric, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignAuthDto {


    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsAlphanumeric()
    @IsNotEmpty()
    @IsOptional()
    tfaCode?: string
}