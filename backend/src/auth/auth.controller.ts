import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, SigninUserDto } from './dto';
import { Public } from './decorator';
import { UserEntity } from './entity';
import { Response } from 'express';
import { ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ACCESS_TOKEN } from './auth.constants';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiCreatedResponse()
  @ApiBody({ type: RegisterUserDto, description: 'Register New User' })
  @Post('register')
  async register(@Body() newUser: RegisterUserDto) {
    return new UserEntity(await this.authService.register(newUser));
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Public()
  @ApiBody({ type: SigninUserDto, description: 'Log in an existing user' })
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() user: SigninUserDto,
  ) {
    return this.authService.login(res, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth(ACCESS_TOKEN)
  @Delete('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
