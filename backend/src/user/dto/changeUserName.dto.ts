import { IsNotEmpty, IsString } from "class-validator";

export class ChangeUserName{
    
    @IsString()
    @IsNotEmpty()
    username: string
}