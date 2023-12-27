/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { User } from "src/generated/prisma/client/mongo";

@Injectable()
export class UsersService {
  constructor(private prismaService: MongoPrismaService) {}

  public async getMany(): Promise<User[]> {
    return await this.prismaService.user.findMany({});
  }

  public async getOne(userUid: string) {
    return await this.prismaService.user.findUnique({ where: { id: userUid } });
  }
}
