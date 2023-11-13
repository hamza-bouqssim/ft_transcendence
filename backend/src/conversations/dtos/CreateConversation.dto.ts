/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString} from "class-validator";

export class createConversationDto{
    @IsNumber()
    @IsNotEmpty()
    display_name: number;

    @IsString()
    @IsNotEmpty()
    message: string;
}