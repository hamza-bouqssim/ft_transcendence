/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { AuthenticatedSocket } from "src/utils/interfaces";

export interface IGateWaySession {
    getSocket(id : number);
}
@Injectable()
export class GateWaySessionManager implements IGateWaySession {
    private readonly sessions: Map<number, AuthenticatedSocket> = new Map();
    getSocket(id: number) {
        this.sessions.get(id);
    }
    setUserSocket(userId : number, socket : AuthenticatedSocket)
    {
        this.sessions.set(userId, socket);
    }
    removeUserSocket(userId : number)
    {
        this.sessions.delete(userId);
    }
    getSockets() : Map<number, AuthenticatedSocket>{
        return this.sessions;
    }
}