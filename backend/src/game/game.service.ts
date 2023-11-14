import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private readonly prisma: PrismaService) {}

    async readyToPlay()
    {
        const queueCount = await this.prisma.queue.count()
        if (queueCount >= 2)
        {
            const  room = await this.prisma.queue.findMany({
                orderBy: {
                  createdAt: 'asc'
                },
                take: 2,
                include: {
                  user: true
                }
              });
            console.log(room);
            console.log("ready to play");
            
        }
    }

    async findUserById(id: string)
    {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });
        return user;
    }

    async joinQueue(userId: string)
    {
        const join = await this.prisma.queue.create({
            data: {
                
                user: {
                    connect: {
                        id: userId,
                        },
                    },
                },
        })
        console.log(join)
        // this.readyToPlay();
        return join;
    }
    
    async leaveQueue(id: string)
    {
        const leave = await this.prisma.queue.delete({
            where: {
                userId: id
            }
        });
        return leave;
    }

    async getQueue()
    {
        const rooms = await this.prisma.queue.findMany({
            include: {
                user: true
            }
        });

        console.log("get rooms : ");
        if (rooms.length > 0)
        {
            console.log(rooms);
            return rooms;
        }
    }
}
