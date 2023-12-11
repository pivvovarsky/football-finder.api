import { Injectable } from "@nestjs/common";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";

@Injectable()
export class AppService {
  constructor(private mongoPrismaSerivce: MongoPrismaService) {}
  getHello(): string {
    return "Hello World!";
  }
}
