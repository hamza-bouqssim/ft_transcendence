import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

export async function whichWithAuthenticated(req: Request, jwtService: JwtService, prisma: PrismaService) {
  const token = req.cookies.token;
  const decodedToken = jwtService.decode(token) as { [key: string]: any };
  let user: any;

  if (decodedToken && decodedToken.email) {
    user = await prisma.user.findUnique({ where: { email: decodedToken.email } });
  } else if (req.user) {
    user = req.user;
  }

  if (!user) {
    throw new UnauthorizedException('User Not Found !');
  }

  return user;
}