import { IsNotEmpty, IsNumber, IsString} from "class-validator";

export class createConversationDto{
    @IsNumber()
    @IsNotEmpty()
    recipientId: number;

    @IsString()
    @IsNotEmpty()
    message: string;
}