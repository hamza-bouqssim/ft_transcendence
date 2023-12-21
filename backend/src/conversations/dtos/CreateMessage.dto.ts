/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class createMessageDto {

    @IsNotEmpty()
    @IsString()
    content : string;

    @IsNotEmpty()
    @IsString()
    participentsId : string;
}