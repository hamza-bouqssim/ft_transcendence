/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthenticatedSocket } from 'src/utils/interfaces';

export interface IGateWaySession {
	getUserSocket(id: string): AuthenticatedSocket | undefined;
	setUserSocket(id: string, socket: AuthenticatedSocket): void;
	removeUserSocket(id: string): void;
	getSockets(): Map<string, AuthenticatedSocket>;
	getOnlineUserIds(): string[];
	getUserBySocketId(socketId: string): User | undefined; // Add this line
}
@Injectable()
export class GateWaySessionManager implements IGateWaySession {
	private sessions: Map<string, AuthenticatedSocket> = new Map();
	getUserSocket(id: string): AuthenticatedSocket | undefined {
		return this.sessions.get(id);
	}
	setUserSocket(id: string, socket: AuthenticatedSocket) {
		this.sessions.set(id, socket);
	}
	removeUserSocket(id: string) {
		this.sessions.delete(id);
	}
	getSockets(): Map<string, AuthenticatedSocket> {
		return this.sessions;
	}
	getOnlineUserIds(): string[] {
		// Implement the logic to get online user IDs
		// For example, you can return an array of all user IDs in the session
		return Array.from(this.sessions.keys());
	}
	getUserBySocketId(socketId: string): User | undefined {
		const socket = Array.from(this.sessions.values()).find(
			(s) => s.id === socketId,
		);
		return socket ? socket.user : undefined;
	}
}
