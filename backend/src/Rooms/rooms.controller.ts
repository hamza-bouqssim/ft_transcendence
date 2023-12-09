/* eslint-disable prettier/prettier */
import { Controller, Get,Body, Res,UseGuards ,Post,Req} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateChatRoom,UpdateChatRoom ,DeleteChatRoom,RoomId} from './dto/rooms.dto';
import { AuthGuard } from '@nestjs/passport';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocketChatGateway } from 'src/gateway/gateway';



@Controller("/rooms")
export class RoomsController {
  constructor(private roomsService:RoomsService ,
    private eventEmitter: EventEmitter2
     ) {}

  //rooms management 

  @Get('/getAllRooms')
  @UseGuards(AuthGuard("jwt"))
  async getAllRooms(@Res() res: any,@Req() req)
  {
    try {
      const {id}=req.user
      const chatRoom = await this.roomsService.getAllRooms(id);
      return res.status(200).json({success : true,data: chatRoom });
    } catch (error) {
      console.log(error.response)
      return res.status(401).json({success : false,message: error.response});
    }

  }


  @Post("/createRooms")
  @UseGuards(AuthGuard("jwt"))
  async createRooms(@Body() data, @Res() res: any , @Req() req) {
    try {
      const {id}=req.user
      const chatRoom = await this.roomsService.creatRooms(data.data,id);
      this.eventEmitter.emit(
        'order.created',
        chatRoom
      );
      return res.status(201).json({data: chatRoom });
    } catch (error) {
      return res.status(500).json({ message: error});
    }
  }


  @Post("/updateRooms")
  @UseGuards(AuthGuard("jwt"))
  async updateRooms(@Body() data, @Res() res: any, @Req() req)
  {
    try {
      const {id}=req.user
      const update = await this.roomsService.updateRooms(data.data,id);
      console.log(update)
      this.eventEmitter.emit(
        'order.update',
      );
      return res.status(200).json({data: update });
    } catch (error) {
      return res.status(500).json({ error: error});
    }

  }

  @Post("/deleteRooms")
  @UseGuards(AuthGuard("jwt"))
  async deleteRooms(@Body() deleteChatRoom: DeleteChatRoom, @Res() res: any, @Req() req)
  {
    try {
      const {id}=req.user
      const deleteRome = await this.roomsService.deleteRooms(deleteChatRoom,id);
      this.eventEmitter.emit(
        'order.delete',
      );
      return res.status(200).json({data: deleteRome });
    } catch (error) {
      return res.status(500).json({ error: error});
    }

  }





  //member mangment 

  @Post("/addMemberToRooms")
  async addMemberToRooms()
  {

  }

  // @Post("/isOwner")
  // @UseGuards(AuthGuard("jwt"))
  // async isOwner(@Body() roomId:RoomId,@Res() res, @Req() req)
  // {
  //   try {
  //     const {id}=req.user
  //     const resisOwner = await this.roomsService.isOwner(id,roomId);
  //     return res.status(200).json({ isOwner: resisOwner });
  //   } catch (error) {
  //     return res.status(500).json({ error: error});
  //   }
  // }

  @Post("/makeOwner")
  async makeOwner()
  {

  }

  @Post("/deleteOwner")
  async deleteOwner()
  {

  }

  @Get("/getAllFreind")
  @UseGuards(AuthGuard("jwt"))
  async getAllFreind(@Res() res: any,@Req() req)
  {
    try {
      const {id}=req.user
      const friend = await this.roomsService.getAllFreind(id);
      return res.status(200).json({data: friend });
    } catch (error) {
      return res.status(500).json({ error: error});
    }


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


