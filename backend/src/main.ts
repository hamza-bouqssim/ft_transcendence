import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(passport.initialize());
	// app.use(passport.session());
	app.use(cookieParser());

	const config = new DocumentBuilder()
		.setTitle('ft_transcendence')
		.setDescription('multiplayer pong web project V')
		.setVersion('1.0')
		.addTag('web')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	app.use(
		session({
			secret:
				'aEyQ1mvAsQv4LRG/Dc/vP/AI3VFzxKEPTwrTBl4RI6Jws3xTQIJTn5Zq50vvTrO6GauggJIoSd2CJtuI5rxz+w==',
			saveUninitialized: false,
			resave: false,
			cookie: {
				maxAge: 86400000, // cookie expire one day later
			},
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(cookieParser());
	// const corsOptions: CorsOptions = {
	//   origin: 'http://localhost:3001', // Replace with your React app's URL
	//   credentials: true, // If you're using cookies or sessions
	// };
	app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
	await app.listen(8000);
}
bootstrap();
