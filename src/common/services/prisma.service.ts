import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "src/generated/prisma/client/mongo";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ log: ["info", "error"] });
  }

  public async onModuleInit() {
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }

  public enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", () => {
      app.close().catch(() => {
        return;
      });
    });
  }
}
