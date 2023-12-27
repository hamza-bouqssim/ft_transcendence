/* eslint-disable prettier/prettier */
import {  IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignAuthDto {


    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsAlphanumeric()
    @IsNotEmpty()
    @IsOptional()
    code?: string
}