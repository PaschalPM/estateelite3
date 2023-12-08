import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

type Include = {
    profile: boolean
}
@Injectable()
export class UserService {

    constructor(private readonly prismaService: PrismaService) {

    }
    async getUserById(id: string, inc: Include = { profile: false }) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }, include: inc
        })
        return user
    }

    async getUserByLogin(usernameOrEmail: string) {
        const userByUsername = await this.prismaService.user.findUnique({
            where: { username: usernameOrEmail }
        })

        const user = userByUsername ?? await this.prismaService.user.findUnique({
            where: { email: usernameOrEmail }
        })

        return user
    }
}
