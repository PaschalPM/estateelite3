import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async cleanDb() {
    await this.$transaction([this.user.deleteMany()]);
  }
}
