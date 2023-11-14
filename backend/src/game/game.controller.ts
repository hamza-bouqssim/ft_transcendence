import { Controller, Post , Get , Delete ,Body} from '@nestjs/common';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}
    @Get()
    test()
    {
        return "test";
    }
    
    @Post('join')
    async joinQueue(@Body('id') id :  string)
    {
        console.log("id",id);
       return await this.gameService.joinQueue(id);
    }

    @Delete('leave')
    async leaveQueue(@Body('id') id: string)
    {
        await this.gameService.leaveQueue(id);
    }

    @Get('ready')
    async readyToPlay()
    {
        return await this.gameService.readyToPlay();
    }

    @Get('queue')
    async getQueue()
    {
        console.log("get queue");
        return "get queue";
        // await this.gameService.getQueue();
    }
}
