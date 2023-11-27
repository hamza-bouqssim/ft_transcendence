import { IsNotEmpty, IsNumber, IsString} from "class-validator";

export class createParticipentDto{
    @IsNumber()
    @IsNotEmpty()
    id: number;

}