import { Controller, Get,Body, Res,UseGuards ,Post,Req} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateChatRoom,UpdateChatRoom ,DeleteChatRoom} from './dto/rooms.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller("/rooms")
export class RoomsController {
  constructor(private roomsService:RoomsService) {}

  //rooms management 

  @Get('/getAllRooms')
  @UseGuards(AuthGuard("jwt"))
  async getAllRooms(@Res() res: any,@Req() req)
  {
    try {
      const {id}=req.user
      console.log("user",req.use)
      const chatRoom = await this.roomsService.getAllRooms(id);
      return res.status(201).json({data: chatRoom });
    } catch (error) {
      return res.status(500).json({ error: error});
    }

  }

  @Post("/createRooms")
  @UseGuards(AuthGuard("jwt"))
  async createRooms(@Body() createChatRoom: CreateChatRoom, @Res() res: any , @Req() req) {
    try {
      const {id}=req.user

      const chatRoom = await this.roomsService.creatRooms(createChatRoom,id);
      return res.status(201).json({ message: 'Room created successfully', data: chatRoom });
    } catch (error) {
      return res.status(500).json({ error: error});
    }
  }


  @Post("/updateRooms")
  @UseGuards(AuthGuard("jwt"))
  async updateRooms(@Body() updateChatRoom: UpdateChatRoom, @Res() res: any, @Req() req)
  {
    try {
      const {userId}=req.user
      const update = await this.roomsService.updateRooms(updateChatRoom,userId);
      return res.status(200).json({ message: 'Room update successfully', data: update });
    } catch (error) {
      return res.status(500).json({ error: error});
    }

  }

  @Post("/deleteRooms")
  @UseGuards(AuthGuard("jwt"))
  async deleteRooms(@Body() deleteChatRoom: DeleteChatRoom, @Res() res: any, @Req() req)
  {
    try {
      const {userId}=req.user
      const deleteRome = await this.roomsService.deleteRooms(deleteChatRoom,userId);
      return res.status(200).json({ message: 'Room delete successfully', data: deleteRome });
    } catch (error) {
      return res.status(500).json({ error: error});
    }

  }





  //member mangment 

  @Post("/addMemberToRooms")
  async addMemberToRooms()
  {

  }

  @Post("/makeOwner")
  async makeOwner()
  {

  }

  @Post("/deleteOwner")
  async deleteOwner()
  {

  }

  @Get("/allMember")
  async allMember()
  {

  }

  @Post("/banMember")
  async banMember()
  {

  }

  @Post("/mutMember")
  async mutMember()
  {

  }

  //modifier 
  @Post("/kekMember")
  async kekMember()
  {

  }

  @Post("/isMember")
  async isMember()
  {

  }

  @Post("/joinRooms")
  async joinRooms()
  {

  }

}


