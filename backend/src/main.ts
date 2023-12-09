import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ACCESS_TOKEN } from './auth/auth.constants';

const appKey = process.env.APP_KEY;
const frontendUrl = process.env.FRONTEND_URL
const DisableTryItOutPlugin = function () {
  return {
    statePlugins: {
      spec: {
        wrapSelectors: {
          allowTryItOutFor: () => () => false,
        },
      },
    },
  };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [frontendUrl, "http://localhost:3000", "http://localhost:5500"],
    credentials: true
  })
  app.setGlobalPrefix('api', { exclude: [''] });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Estateelite3 API')
    .setDescription('Welcome to Estateelite3 API')
    .setVersion('1.0')
    .addCookieAuth(ACCESS_TOKEN)
    .addTag('Estateelite3')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      plugins: [DisableTryItOutPlugin],
    },
  });

  app.use(cookieParser(appKey));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
