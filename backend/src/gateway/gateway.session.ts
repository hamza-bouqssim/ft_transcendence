/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { AuthenticatedSocket } from "src/utils/interfaces";

export interface IGateWaySession {
    getUserSocket(id : string) : AuthenticatedSocket | undefined;
    setUserSocket(id : string, socket : AuthenticatedSocket) : void;
    removeUserSocket(id : string) :void;
    getSockets(): Map<string, AuthenticatedSocket>;
}
@Injectable() 
export class GateWaySessionManager implements IGateWaySession {
    private sessions: Map<string, AuthenticatedSocket> = new Map();
    getUserSocket(id: string) : AuthenticatedSocket | undefined {
        return this.sessions.get(id);
    }
    setUserSocket(id : string, socket : AuthenticatedSocket)
    {
        this.sessions.set(id, socket);
    }
    removeUserSocket(id : string)
    {
        this.sessions.delete(id);
    }
    getSockets() : Map<string, AuthenticatedSocket>{
        return this.sessions;
    }
}