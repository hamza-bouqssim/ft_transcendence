/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto{
   

    @IsString()
    @IsNotEmpty()
    display_name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    
    @IsString()
    @IsNotEmpty()
    username?: string;

    @IsString()
    password?: string;

    @IsString()
    two_factor_auth?: string;

    @IsString()
    two_factor_secret_key?: string;

    @IsString()
    avatar_url?: string
}