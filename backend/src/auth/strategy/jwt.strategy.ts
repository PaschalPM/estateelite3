import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ACCESS_TOKEN } from '../auth.constants';

@Injectable()
export class JwtStrategy {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAndSetTokenCookie(res: Response, userId: string) {
    const payload = {
      sub: userId,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.getJwtExpiresIn(),
      secret: this.configService.getAppKey()
    });

    res.cookie(
      ACCESS_TOKEN,
      accessToken,
      this.configService.getJwtCookieOptions(),
    );
  }
}
