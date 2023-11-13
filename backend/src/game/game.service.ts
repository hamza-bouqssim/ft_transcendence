import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private readonly prisma: PrismaService) {}

    async readyToPlay(user: any)
    {
        const queueCount = await this.prisma.queue.count()
        if (queueCount >= 2)
        {
            console.log("ready to play");
        }
    }

    async joinQueue(user: any)
    {
        const join = await this.prisma.queue.create({
            data: {
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        });
        return join;
    }

    // async leaveQueue(user: any)
    // {
    //     const leave = await this.prisma.queue.delete({
    //         where: {
    //             userId: user.id
    //         }
    //     });
    //     return leave;
    // }
}
