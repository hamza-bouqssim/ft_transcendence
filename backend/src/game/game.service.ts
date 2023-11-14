import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

enum EventType {
    UNPROCESSED,
    FINAL
  }

@Injectable()
export class GameService {
    constructor(private readonly prisma: PrismaService) {}


    //part of queue
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
            const [userIdOne, userIdTwo] = [room[0].user.id, room[1].user.id];
            await this.leaveQueue(userIdOne);
            await this.leaveQueue(userIdTwo);
            //Pong_match(userIdOne, userIdTwo)
            console.log("ready to play");
            return await this.prisma.queue.count()
        }
        console.log("not enough players",);
        return queueCount;
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
                user: { connect: { id: userId } },
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
        console.log(rooms);
        return rooms;
    }

    // part of pong_match

    async createPongMatch(userIdOne : string, userIdTwo : string)
    {
        const match = await this.prisma.pong_match.create({
            data: {
                playerOne: { connect: { id: userIdOne } },
                playerTwo: { connect: { id: userIdTwo } },
                },
        })
        console.log(match)
        return match;
    }

    async getPongMatch(id: string)
    {
        const match = await this.prisma.pong_match.findUnique({
            where: {
                id: id
            }
        });
        return match;
    }
    
    async deletePongMatch(id: string)
    {
        const match = await this.prisma.pong_match.delete({
            where: {
                id: id
            }
        });
        return match;
    }

    async endPongMatch(id: string)
    {
        const match = await this.prisma.pong_match.update({
            where: {
                id: id
            },
            data: {
                updated_at: new Date(),
                // envent : FINAL,
            }
        });
        return match;
    }

    // part of match_history
    async createMatchHistory(userIdOne : string, userIdTwo : string,
                            playerOne_score : number, playerTwo_score : number, matchId : string)
    {
        const match = await this.prisma.match_History.create({
            data: {
                playerone: { connect: { id: userIdOne } },
                playertwo: { connect: { id: userIdTwo } },
                playerOne_score: playerOne_score,
                playerTwo_score: playerTwo_score,
                match : { connect : { id: matchId } },
            },
        })
        console.log(match)
        return match;
    }
}
