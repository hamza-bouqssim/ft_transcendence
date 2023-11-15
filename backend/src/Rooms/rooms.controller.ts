import { Controller, Get,Body, Res,UseGuards ,Post} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateChatRoom } from './dto/rooms.dto';



@Controller("/rooms")
export class RoomsController {
  constructor(private roomsService:RoomsService) {}


  //rooms management 

  @Get('/getAllRooms')
  async getAllRooms()
  {

  }

  @Post("/createRooms")
  async createRooms(@Body() createChatRoom: CreateChatRoom, @Res() res: any) {
    try {
      const chatRoom = await this.roomsService.creatRooms(createChatRoom);
      return res.status(201).json({ message: 'Room created successfully', data: chatRoom });
    } catch (error) {
      return res.status(500).json({ error: error});
    }
  }


  @Post("/updateRooms")
  async updateRooms()
  {

  }

  @Post("/deleteRooms")
  async deleteRooms()
  {

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
