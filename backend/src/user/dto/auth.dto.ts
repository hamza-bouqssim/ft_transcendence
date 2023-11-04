/* eslint-disable prettier/prettier */
import {IsString, IsEmail} from "class-validator"

export class LoginDto {

    @IsEmail()
    email : string;

    @IsString()
    password : string;


}