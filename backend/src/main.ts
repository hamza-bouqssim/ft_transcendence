/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
// import expressSession from 'express-session';
import {  PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
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
        store: new PrismaSessionStore(new PrismaClient(), {
          checkPeriod: 2 * 60 * 1000, //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined
        }),
        secret: "aEyQ1mvAsQv4LRG/Dc/vP/AI3VFzxKEPTwrTBl4RI6Jws3xTQIJTn5Zq50vvTrO6GauggJIoSd2CJtuI5rxz+w==",
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge : 86400000, // cookie expire one day later
        },
      
      }),
    );
  app.use(passport.initialize());
  app.use(passport.session())
  app.use(cookieParser());
  app.enableCors({ origin : ['http://localhost:3000'], credentials: true})
  await app.listen(8000);
}
bootstrap();
