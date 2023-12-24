/* eslint-disable prettier/prettier */
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { User } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FriendRequestService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly eventEmitter: EventEmitter2,
	) {}
	async allMyFriends(id: string) {
		const user = await this.prisma.user.findFirst({ where: { id: id } });
		if (!user) {
			throw new HttpException('User Not Found !', HttpStatus.BAD_REQUEST);
		}
	}
	async sendRequest(_Display_name: string, friendDisplay_name: string) {
		const user = await this.prisma.user.findFirst({
			where: { display_name: _Display_name },
		});
		const _friendDisplay_name = await this.prisma.user.findFirst({
			where: { display_name: friendDisplay_name },
		});

		if (!user || !_friendDisplay_name) {
			throw new HttpException('User Not Found !', HttpStatus.BAD_REQUEST);
		}

		if (friendDisplay_name === _Display_name) {
			throw new HttpException(
				'You cant send request to your self!',
				HttpStatus.BAD_REQUEST,
			);
		}

		const requestAlreadySent = await this.prisma.friend.findFirst({
			where: {
				OR: [
					{
						user_id: user.id,
						friend_id: _friendDisplay_name.id,
						status: 'PENDING',
					},
					{
						user_id: _friendDisplay_name.id,
						friend_id: user.id,
						status: 'PENDING',
					},
				],
			},
		});

		if (requestAlreadySent) {
			throw new HttpException('Request Already Sent !', HttpStatus.BAD_REQUEST);
		}
		const alrighdyfriend = await this.prisma.friend.findFirst({
			where: {
				OR: [
					{
						user_id: user.id,
						friend_id: _friendDisplay_name.id,
						status: 'ACCEPTED',
					},
					{
						user_id: _friendDisplay_name.id,
						friend_id: user.id,
						status: 'ACCEPTED',
					},
				],
			},
		});

		if (alrighdyfriend) {
			throw new HttpException(
				'You are alrighdy Friends !',
				HttpStatus.BAD_REQUEST,
			);
		}
		const BlockedFriends = await this.prisma.blockList.findFirst({
			where: {
				OR: [
					{ userOneId: user.id, userTwoId: _friendDisplay_name.id },
					{ userOneId: _friendDisplay_name.id, userTwoId: user.id },
				],
			},
		});

		if (BlockedFriends) {
			throw new HttpException(
				'You cant send request because you blocked each other',
				HttpStatus.BAD_REQUEST,
			);
		}

		const friendData = await this.prisma.friend.create({
			data: {
				user_id: user.id,
				friend_id: _friendDisplay_name.id,
				status: 'PENDING',
				created_at: new Date(),
			},
			include: {
				user: true,
				friends: true,
			},
		});

		this.eventEmitter.emit('request.created', {
			friendData,
		});

		return { message: 'Friend request sent successfully' };
	}

	//send request to play
	async sendRequestPlay(
		senderDisplay_name: string,
		recipientDisplay_name: string,
	) {
		const user = await this.prisma.user.findFirst({
			where: { display_name: senderDisplay_name },
		});
		const recipientUser = await this.prisma.user.findFirst({
			where: { display_name: recipientDisplay_name },
		});
		if (!user || !recipientUser) {
			throw new HttpException('User Not Found!', HttpStatus.BAD_REQUEST);
		}
		if (senderDisplay_name === recipientDisplay_name) {
			throw new HttpException(
				'You cant send request to your self!',
				HttpStatus.BAD_REQUEST,
			);
		}

		const alrighdyfriend = await this.prisma.friend.findFirst({
			where: {
				OR: [
					{
						user_id: user?.id,
						friend_id: recipientUser?.id,
					},
					{
						user_id: recipientUser?.id,
						friend_id: user?.id,
					},
				],
			},
		});
		if (!alrighdyfriend) {
			throw new HttpException(
				'This is not your friend,  you cant play with !',
				HttpStatus.BAD_REQUEST,
			);
		}

		const requestAlreadySent = await this.prisma.requestPlay.findFirst({
			where: {
				OR: [
					{
						senderId: user.id,
						recipientId: recipientUser.id,
						status: 'PENDING',
					},
					{
						senderId: recipientUser.id,
						recipientId: user.id,
						status: 'PENDING',
					},
				],
			},
		});
		if (requestAlreadySent) {
			throw new HttpException('Request Already Sent !', HttpStatus.BAD_REQUEST);
		}

		const BlockedFriends = await this.prisma.blockList.findFirst({
			where: {
				OR: [
					{ userOneId: user.id, userTwoId: recipientUser.id },
					{ userOneId: recipientUser.id, userTwoId: user.id },
				],
			},
		});

		if (BlockedFriends) {
			throw new HttpException(
				'You cant send request because you blocked each other',
				HttpStatus.BAD_REQUEST,
			);
		}
		const requestToPlay = await this.prisma.requestPlay.create({
			data: {
				senderId: user.id,
				recipientId: recipientUser.id,
				status: 'PENDING',
			},
			include: {
				Sender: true,
				recipient: true,
			},
		});
		this.eventEmitter.emit('chat.invite', { requestToPlay });
		return { message: 'Request to play sent succesfully' };
	}

	async acceptRequestToPlay(requestId: string, user: User) {
		const req_play = await this.prisma.requestPlay.findUnique({
			where: {
				id: requestId,
			},
			include: {
				Sender: true,
				recipient: true,
			},
		});

		if (!req_play)
			throw new HttpException(
				"The request doesn't exist!",
				HttpStatus.BAD_REQUEST,
			);

		if (req_play.senderId === user.id)
			throw new HttpException(
				'You are not the person who send this request',
				HttpStatus.BAD_REQUEST,
			);

		await this.prisma.requestPlay.update({
			where: { id: requestId },
			data: { status: 'ACCEPTED' },
		});

		await this.prisma.notificationGlobal.deleteMany({
			where: {
				requestId: requestId,
			},
		});
		console.log("emitit l sokaina")
		this.eventEmitter.emit('game.accept', {
			req_play,
		});
		

		console.log("accccccccccccccccccccccccccccccccccccccccccept")

		return { message: 'Accept request to play succesfully' };
	}

	async acceptFriendRequest(requestId: string, user: User) {
		const req = await this.prisma.friend.findUnique({
			where: {
				id: requestId,
			},
			include: {
				user: true,
				friends: true,
			},
		});
		if (!req)
			throw new HttpException(
				"The request doesn't exist",
				HttpStatus.BAD_REQUEST,
			);

		if (req.user_id === user.id)
			throw new HttpException(
				'You are not authorized to accept this friend request',
				HttpStatus.BAD_REQUEST,
			);

		await this.prisma.friend.update({
			where: { id: requestId },
			data: { status: 'ACCEPTED' },
		});
		await this.prisma.notificationGlobal.deleteMany({
			where: {
				requestId: requestId,
			},
		});

		this.eventEmitter.emit('requestAccept.created', {
			req,
		});

		return { message: 'Friend request accepted' };
	}

	async refuseFriendRequest(requestId: string, user: User) {
		const req = await this.prisma.friend.findUnique({
			where: { id: requestId },
		});

		if (!req) {
			throw new HttpException(
				"The request doesn't exist",
				HttpStatus.BAD_REQUEST,
			);
		}

		if (req.friend_id !== user.id) {
			throw new HttpException(
				'You are not authorized to refuse this friend request',
				HttpStatus.BAD_REQUEST,
			);
		}

		await this.prisma.friend.delete({ where: { id: requestId } });
		await this.prisma.notificationGlobal.deleteMany({
			where: {
				requestId: requestId,
			},
		});

		this.eventEmitter.emit('requestRefuse.created', {
			RefuseruserId: req.friend_id,
		});

		return { message: 'Friend request refused.' };
	}

	async refusePLayRequest(requestId: string, user: User) {
		const req = await this.prisma.requestPlay.findUnique({
			where: { id: requestId },
		});

		if (!req) {
			throw new HttpException(
				"The request doesn't exist",
				HttpStatus.BAD_REQUEST,
			);
		}
		if (req.senderId === user.id) {
			throw new HttpException(
				'You are not authorized to refuse this playing request',
				HttpStatus.BAD_REQUEST,
			);
		}
		await this.prisma.requestPlay.delete({ where: { id: requestId } });
		await this.prisma.notificationGlobal.deleteMany({
			where: {
				requestId: requestId,
			},
		});

		this.eventEmitter.emit('requestRefusePlay.created', {
			RefuseruserId: req.senderId,
		});

		return { message: 'PLaying request refused.' };
	}

	async block(senderId: string, recipientId: string) {
		const user = await this.prisma.user.findFirst({ where: { id: senderId } });
		const recipientUser = await this.prisma.user.findFirst({
			where: { id: recipientId },
		});
		if (senderId === recipientId)
			throw new HttpException(
				'You cant block your self',
				HttpStatus.BAD_REQUEST,
			);

		if (!user || !recipientUser) {
			throw new HttpException('User Not Found!', HttpStatus.BAD_REQUEST);
		}
		const checkBlocking = await this.prisma.blockList.findFirst({
			where: {
				AND: [{ userOneId: senderId, userTwoId: recipientId }],
			},
		});
		if (checkBlocking)
			throw new HttpException('Alrighdy blocked', HttpStatus.BAD_REQUEST);

		const friendship = await this.prisma.friend.findFirst({
			where: {
				OR: [
					{
						user_id: senderId,
						friend_id: recipientId,
						status: { in: ['ACCEPTED', 'PENDING'] },
					},
					{
						user_id: recipientId,
						friend_id: senderId,
						status: { in: ['ACCEPTED', 'PENDING'] },
					},
				],
			},
		});

		// If there is a friendship, delete it
		if (friendship) {
			await this.prisma.friend.delete({
				where: { id: friendship.id },
			});
		}
		const friendshipPlay = await this.prisma.requestPlay.findFirst({
			where: {
				OR: [
					{
						senderId: senderId,
						recipientId: recipientId,
						status: { in: ['ACCEPTED', 'PENDING'] },
					},
					{
						senderId: recipientId,
						recipientId: senderId,
						status: { in: ['ACCEPTED', 'PENDING'] },
					},
				],
			},
		});

		if (friendshipPlay) {
			await this.prisma.requestPlay.delete({
				where: { id: friendshipPlay.id },
			});
		}
		await this.prisma.blockList.create({
			data: {
				userOneId: senderId,
				userTwoId: recipientId,
			},
			include: {
				userOne: true,
				userTwo: true,
			},
		});

		const chatParticipents = await this.prisma.chatParticipents.findFirst({
			where: {
				OR: [
					{ senderId: senderId, recipientId: recipientId },
					{ senderId: recipientId, recipientId: senderId },
				],
			},
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						display_name: true,
						avatar_url: true,
					},
				},
				recipient: {
					select: {
						id: true,
						username: true,
						display_name: true,
						avatar_url: true,
					},
				},
			},
		});

		this.eventEmitter.emit('requestBlock.created', {
			chatParticipents,
		});

		return { message: 'Blocked succefully' };
	}

	async unblock(senderId: string, recipientId: string) {
		const user = await this.prisma.user.findFirst({ where: { id: senderId } });
		const recipientUser = await this.prisma.user.findFirst({
			where: { id: recipientId },
		});
		console.log('user: ', user);
		console.log('rec : ', recipientUser);
		if (!user || !recipientUser) {
			throw new HttpException('User Not Found!', HttpStatus.BAD_REQUEST);
		}
		const checkBlocking = await this.prisma.blockList.findFirst({
			where: {
				AND: [{ userOneId: senderId, userTwoId: recipientId }],
			},
		});
		if (!checkBlocking)
			throw new HttpException(
				'You are not blocked this user ',
				HttpStatus.BAD_REQUEST,
			);

		await this.prisma.blockList.delete({
			where: {
				id: checkBlocking.id,
			},
		});

		const chatParticipents = await this.prisma.chatParticipents.findFirst({
			where: {
				OR: [
					{ senderId: senderId, recipientId: recipientId },
					{ senderId: recipientId, recipientId: senderId },
				],
			},
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						display_name: true,
						avatar_url: true,
					},
				},
				recipient: {
					select: {
						id: true,
						username: true,
						display_name: true,
						avatar_url: true,
					},
				},
			},
		});

		this.eventEmitter.emit('requestDebloque.created', {
			chatParticipents,
		});

		return { message: 'Unblocked succefully' };
	}

	async deleteMessagesWithUser(userId: string, blockedUserId: string) {
		await this.prisma.message.deleteMany({
			where: {
				participents: {
					OR: [
						{ senderId: userId, recipientId: blockedUserId },
						{ senderId: blockedUserId, recipientId: userId },
					],
				},
			},
		});
	}
	async remove_friends(userDisplay_name: string, Refusedisplay_name: string) {
		const user = await this.prisma.user.findFirst({
			where: { display_name: userDisplay_name },
		});
		const refuseUser = await this.prisma.user.findFirst({
			where: { display_name: Refusedisplay_name },
		});

		if (!user || !refuseUser) {
			throw new HttpException('User Not Found!', HttpStatus.BAD_REQUEST);
		}
		const friendship = await this.prisma.friend.findFirst({
			where: {
				OR: [
					{ user_id: user.id, friend_id: refuseUser.id, status: 'ACCEPTED' },
					{ user_id: refuseUser.id, friend_id: user.id, status: 'ACCEPTED' },
				],
			},
		});

		if (!friendship) {
			throw new HttpException(
				'This is not your friend,  To refuse the friendship!',
				HttpStatus.BAD_REQUEST,
			);
		}

		if (friendship) {
			await this.prisma.friend.delete({
				where: { id: friendship.id },
			});
		}
		this.eventEmitter.emit('deleteFriendship.created', {
			friendship,
		});

		return { message: 'Delete the frienbdship' };
	}
	async count_notification(user_id: string) {
		const unreadCount = await this.prisma.notificationGlobal.count({
			where: {
				recipient_id: user_id,
				vue: false,
			},
		});
		return unreadCount;
	}
	async DeleteNotification(idNotif: string) {
		try {
			const data = await this.prisma.notificationGlobal.delete({
				where: {
					id: idNotif,
				},
			});
			this.eventEmitter.emit('deleteNotification.created', {
				data,
			});
			return { success: true, message: 'Notification deleted successfully' };
		} catch (error) {
			console.error('Error deleting notification:', error);
			return { success: false, message: 'Error deleting notification' };
		}
	}
}
