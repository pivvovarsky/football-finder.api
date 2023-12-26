/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { User } from "src/generated/prisma/client/mongo";

@Injectable()
export class UsersService {
  constructor(private prismaService: MongoPrismaService) {}

  private isValidID(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(
        "Invalid ID - ObjectID: provided hex string representation must be exactly 12 bytes",
      );
    }
  }

  public async getMany(): Promise<User[]> {
    return await this.prismaService.user.findMany({});
  }

  public async getOne(userUid: string) {
    return await this.prismaService.user.findUnique({ where: { id: userUid } });
  }
}
