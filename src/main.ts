import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import helmet from "helmet";
import { setupSwagger } from "./config/setup-swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { ApiConfigService } from "./common/services/api-config.service";
import { MongoPrismaService } from "./common/services/mongo-prisma.service";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ApiConfigService = app.get(ApiConfigService);
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix(configService.api.prefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const prismaService: MongoPrismaService = app.get(MongoPrismaService);
  prismaService.enableShutdownHooks(app);
  setupSwagger(app, configService);

  await app.listen(configService.api.port);
}
bootstrap().catch(console.error);

// if (module.hot) {
//   module.hot.accept();
//   module.hot.dispose(() => app.close());
// }
