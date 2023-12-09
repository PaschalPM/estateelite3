import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ACCESS_TOKEN } from '../auth.constants';
import { UserService } from '../../user/user.service';

type JwtDecoded = {
  sub: string;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtStrategy {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async generateAndSetTokenCookie(res: Response, userId: string) {
    const payload = {
      sub: userId,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.getJwtExpiresIn(),
      secret: this.configService.getAppKey(),
    });

    res.cookie(
      ACCESS_TOKEN,
      accessToken,
      this.configService.getJwtCookieOptions(),
    );
  }

  async verifyTokenFromCookie(req: Request) {
    const token = req.cookies?.[ACCESS_TOKEN];
    if (!token) throw new ForbiddenException('Missing JWT Cookie');

    try {
      const decodedToken: JwtDecoded = await this.jwtService.verify(token, {
        secret: this.configService.getAppKey(),
      });
      const user = await this.userService.getUserById(decodedToken.sub);
      return user;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  async implicitRefresh(req: Request, res: Response) {
    const token = req.cookies?.[ACCESS_TOKEN];
    if (!token) return;

    try {
      const decodedToken: JwtDecoded = await this.jwtService.verify(token, {
        secret: this.configService.getAppKey(),
      });

      const exp = decodedToken.exp;
      const userId = decodedToken.sub;
      const currentTimeInSecs = this.convertToSec(Date.now());
      const halfJwtDuration =
        this.convertToSec(this.configService.getJwtExpiresIn(true)) / 2;

      if (currentTimeInSecs + halfJwtDuration >= exp) {
        await this.generateAndSetTokenCookie(res, userId);
      }
    } catch (e) {
      return;
    }
  }

  private convertToSec(ms: number) {
    return Math.floor(ms / 1000);
  }
}
