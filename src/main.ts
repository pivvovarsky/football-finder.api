import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { ApiConfigService, PrismaService } from "./common/services";
import helmet from "helmet";
import { setupSwagger } from "./config/setup-swagger";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ApiConfigService = app.get(ApiConfigService);
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix(configService.api.prefix);
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  setupSwagger(app, configService);

  await app.listen(configService.api.port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap().catch(console.error);
