import { IsNotEmpty, IsString } from "class-validator";

export class ChangeUserDisplayedName{

    @IsString()
    @IsNotEmpty()
    display_name: string;
}