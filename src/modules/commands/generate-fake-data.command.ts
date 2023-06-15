import { Logger } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";

@Command({ name: "generate-fake-data", description: "Generate fake data to mongo database" })
export class GenerateFakeData extends CommandRunner {
  constructor(private readonly logger: Logger, private mongoPrisma: MongoPrismaService) {
    super();
  }

  async run() {
    await console.log("dziala");
  }
}
