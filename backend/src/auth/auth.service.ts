import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto, SigninUserDto } from './dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { UserService } from '@/user/user.service';
import { Response } from 'express';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ACCESS_TOKEN } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async register({ password, ...newUser }: RegisterUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...newUser,
          hash: await this.generateHash(password),
        },
      });
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('User already exists');
      }
    }
  }

  async login(res: Response, user: SigninUserDto) {
    const validUser = await this.userService.getUserByLogin(user.login);

    if (!validUser) throw new UnauthorizedException('Invalid login details');
    if (!this.verify(user, validUser))
      throw new UnauthorizedException('Invalid password');

    await this.jwtStrategy.generateAndSetTokenCookie(res, validUser.id);
    return { message: 'User logged in successfully' };
  }

  async logout(res: Response) {
    res.clearCookie(ACCESS_TOKEN);
  }

  private async generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  private async verify(user: SigninUserDto, validUser: User) {
    return await bcrypt.compare(user.password, validUser.hash);
  }
}
