import { Controller, Get, UseGuards ,Post} from '@nestjs/common';
import { RoomsService } from './rooms.service';


@Controller("/rooms")
export class RoomsController {
  constructor(private roomsService:RoomsService) {}


  //rooms management 

  @Get('/getAllRooms')
  async getAllRooms()
  {

  }

  @Post("/creatRooms")
  async creatRooms()
  {

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
