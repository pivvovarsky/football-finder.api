import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
// import { setupLogger } from "./config/setup-logger";
import { WorkerModule } from "./modules/worker/worker.module";
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    // logger: setupLogger(process.env.NODE_ENV === "production" ? "json" : "dev"),
  });

  const logger = app.get(Logger);
  logger.log("Worker successfully started");

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap()
  // eslint-disable-next-line no-console
  .catch(console.error);
