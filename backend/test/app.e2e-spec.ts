import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as cookieParser from 'cookie-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { RegisterUserDto } from '../src/auth/dto';

describe('App e2e', () => {
  const appKey = process.env.APP_KEY;
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = (await moduleRef).createNestApplication();
    app.use(cookieParser(appKey));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(3333);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333/api');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const authDto1: RegisterUserDto = {
      username: 'user1',
      email: 'user1@gmail.com',
      password: '12345678',
    };
    const authDto2: RegisterUserDto = {
      username: 'user2',
      email: 'user2@gmail.com',
      password: '12345678',
    };

    describe('Register', () => {
      it('Should create new user', () =>
        pactum
          .spec()
          .post('/auth/register')
          .withBody(authDto1)
          .expectStatus(201));

      it('Should not create same user', () =>
        pactum
          .spec()
          .post('/auth/register')
          .withBody(authDto1)
          .expectStatus(400));

      it('Should not create without password', () =>
        pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: authDto2.email, username: authDto2.username })
          .expectStatus(400));

      it('Should not create without email', () =>
        pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: authDto2.password,
            username: authDto2.username,
          })
          .expectStatus(400));

      it('Should not create without username', () =>
        pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: authDto2.password,
            email: authDto2.email,
          })
          .expectStatus(400));
      it('Should not create with wrongly email format', () =>
        pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: authDto2.password,
            email: 'user2gmail.com',
            username: authDto2.username,
          })
          .expectStatus(400));
    });
  });
});
