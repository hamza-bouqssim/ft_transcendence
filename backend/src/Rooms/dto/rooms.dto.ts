import { IsNotEmpty, IsString ,IsArray} from "class-validator";


export class RoomId{
    @IsNotEmpty()
    @IsString()
    id:string;
}

export class CreateMessageRoom{
    @IsNotEmpty()
    @IsString()
    content :string;

    @IsNotEmpty()
    @IsString()
    chatRoomId :string;


}

export class Member{
    @IsNotEmpty()
    @IsString()
    id:string;

    @IsNotEmpty()
    @IsString()
    userId:string;
}

export class CreateChatRoom{

    @IsNotEmpty()
    @IsString()
    name :string;

    @IsNotEmpty()
    @IsString()
    Privacy :string;

    @IsString()
    password :string;

    @IsString()
    picture :string;

    @IsArray()
    @IsString({ each: true })
    idUserAdd: string[];

}
export class UpdateChatRoom{
   
    @IsNotEmpty()
    @IsString()
    id :string;

    @IsNotEmpty()
    @IsString()
    name :string;

    @IsNotEmpty()
    @IsString()
    Privacy :string;

    @IsString()
    password :string;

    @IsString()
    picture :string;

}

export class DeleteChatRoom{


    @IsNotEmpty()
    @IsString()
    id :string;


}

export class muteData{
    @IsNotEmpty()
    @IsString()
    muteDuration:string

    @IsNotEmpty()
    @IsString()
    id:string;

    @IsNotEmpty()
    @IsString()
    userId:string;
}


export class getAllRooms{
   
    @IsNotEmpty()
    @IsString()
    id :string;

}

export class JoinRooms{
   
    @IsNotEmpty()
    @IsString()
    id :string;

    @IsNotEmpty()
    @IsString()
    Privacy :string;


    @IsString()
    password :string;
}