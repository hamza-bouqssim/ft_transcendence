 import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';

// const prisma = new PrismaClient();

const generateFakeUser = () => ({
	username: faker.internet.userName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	display_name: faker.name.findName(),
	avatar_url: faker.image.avatar(),
	two_factor_auth: faker.random.boolean().toString(),
	two_factor_secret_key: faker.random.alphaNumeric(20),
});

const generateFakeFriends = (users: { id: string }[]) => {
	return Array.from({ length: 10 }, () => {
		let user, friend;

		do {
			user = faker.random.arrayElement(users);
			friend = faker.random.arrayElement(users);
		} while (user.id === friend.id);

		return {
			user_id: user.id,
			friend_id: friend.id,
			status: faker.random.arrayElement(['PENDING', 'ACCEPTED']),
			created_at: faker.date.past(),
		};
	});
};

const generateFakeBlockUser = (users: { id: string }[]) => {
	return Array.from({ length: 5 }, () => {
		let user, blocked;

		do {
			user = faker.random.arrayElement(users);
			blocked = faker.random.arrayElement(users);
		} while (user.id === blocked.id);

		return {
			userId: user.id,
			blockedUserId: blocked.id,
			createdAt: faker.date.past(),
		};
	});
};

// async function seed() {
//   const userCount = await prisma.user.count();

//   if (userCount === 0) {
//     const createdUsers = [];
//     for (let i = 0; i < 10; i++) {
//         const user = await prisma.user.create({
//             data: generateFakeUser(),
//         });
//         createdUsers.push(user);
//     }

//     const friend = await prisma.friend.createMany({
//         data: generateFakeFriends(createdUsers),
//     });

//     const blockUser = await prisma.blockUser.createMany({
//         data: generateFakeBlockUser(createdUsers),
//     });
   
//     console.log('User and Friend data inserted successfully');
//   } else {
//     console.log('User model is not empty. Skipping seed data.');
//   }
// }

// seed()
//   .catch((error) => {
//     throw error;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
