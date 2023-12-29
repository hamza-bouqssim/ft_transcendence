/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { WebSocketAdapter } from './gateway/gateway.adapter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(passport.initialize());
	app.use(cookieParser());
  const adapter = new WebSocketAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('multiplayer pong web project V')
    .setVersion('1.0')
    .addTag('web')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); 

  app.enableCors({ origin : ['http://localhost:3000'], credentials: true})
  await app.listen(8000,'0.0.0.0');
}
bootstrap();
