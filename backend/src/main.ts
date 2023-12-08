import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ACCESS_TOKEN } from './auth/auth.constants';

const appKey = process.env.APP_KEY

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
  .setTitle("Estateelite3 API")
  .setDescription("Welcome to Estateelite3 API")
  .setVersion("1.0")
  .addCookieAuth(ACCESS_TOKEN)
  .addTag("Estateelite3")
  .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)
  
  app.use(cookieParser(appKey))
  app.setGlobalPrefix("api", { exclude: [''] })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }))

  await app.listen(3000);
}
bootstrap();
