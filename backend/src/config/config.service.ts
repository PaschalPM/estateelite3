import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';
import { toMs } from 'ms-typescript';

@Injectable()
export class ConfigService {
  private appKey: string = 'secret_key';
  private jwtExpiresIn: string = '2m';

  public constructor(private readonly nsc: NestConfigService) {}

  public getAppKey() {
    const appKey = this.nsc.get('APP_KEY') ?? this.appKey;
    return appKey;
  }

  public getJwtExpiresIn(inMs: boolean = false) {
    const jwtExpiresIn = this.nsc.get('JWT_EXPIRES_IN') ?? this.jwtExpiresIn;
    return inMs ? toMs(jwtExpiresIn) : jwtExpiresIn;
  }

  public getJwtCookieOptions() {
    const cookieOption: CookieOptions = {
      httpOnly: true,
      maxAge: this.getJwtExpiresIn(true),
      secure: this.nsc.get('ENV') === 'production' ? true : false,
      sameSite: this.nsc.get('ENV') === 'production' ? 'none' : 'strict',
    };
    return cookieOption;
  }
}
