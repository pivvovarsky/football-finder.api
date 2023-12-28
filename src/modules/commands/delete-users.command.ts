import { Logger } from "@nestjs/common";
import { DeleteUsersResult } from "firebase-admin/lib/auth/base-auth";
import { Command, CommandRunner } from "nest-commander";
import { FirebaseService } from "src/common/services/firebase/firebase.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Prisma } from "src/generated/prisma/client/mongo";
// command to run script:  npm run delete-users

@Command({ name: "delete-users", description: "Delete users from MongoDB and Firebase" })
export class DeleteUsers extends CommandRunner {
  constructor(
    private prismaService: MongoPrismaService,
    private firebaseService: FirebaseService,
    private logger: Logger,
  ) {
    super();
  }

  async deleteUsers() {
    const prismaUsers = await this.prismaService.user.findMany({});
    const usersUids: string[] = [];
    let prismaUsersDeleteResult: null | Prisma.BatchPayload = null;
    for (const user of prismaUsers) {
      usersUids.push(user.id);

      prismaUsersDeleteResult = await this.prismaService.user.deleteMany({
        where: { id: { in: usersUids } },
      });
    }

    let result: DeleteUsersResult | null = null;
    if (prismaUsersDeleteResult) result = await this.firebaseService.auth.deleteUsers(usersUids);

    console.log("deleted users uids:", usersUids, "result:", result);
  }

  async run() {
    this.logger.log("starting delete users from database!");

    await this.deleteUsers()
      .then(() => console.log("completed delete users!\n"))
      .catch((err) => console.error(err));

    console.log("Delete users from database completed!");
  }
}
