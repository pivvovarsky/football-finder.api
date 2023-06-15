import { CommandFactory } from "nest-commander";
import { CommandsModule } from "./modules/commands/commands.module";
import {} from "@nestjs/common";

async function bootstrap() {
  await CommandFactory.run(CommandsModule, {
    errorHandler: (err) => {
      console.error(err);
    },
  });
}

bootstrap()
  // eslint-disable-next-line no-console
  .catch(console.error);
