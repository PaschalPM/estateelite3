import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtGuard } from './auth/guard';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtInterceptor } from './auth/interceptor';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule,
    AuthModule,
    PrismaModule,
    UserModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtInterceptor
    }
  ],
})
export class AppModule {}
