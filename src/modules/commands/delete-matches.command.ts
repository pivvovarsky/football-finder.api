import { Logger } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";

// command to run script:  npm run delete-matches

@Command({ name: "delete-matches", description: "Deletes all matches" })
export class DeleteMatches extends CommandRunner {
  constructor(private prismaService: MongoPrismaService, private logger: Logger) {
    super();
  }

  async deleteMatches() {
    try {
      await this.prismaService.match.deleteMany({});
    } catch (error) {
      console.error(error);
    }
  }

  async run() {
    this.logger.log("starting delete matches!");

    await this.deleteMatches()
      .then(() => console.log("completed deleted matches!\n"))
      .catch((err) => console.error(err));

    console.log("DeleteMatches completed!");
  }
}
