import { IsNotEmpty, IsString } from "class-validator";


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




export class getAllRooms{
   
    @IsNotEmpty()
    @IsString()
    id :string;

}