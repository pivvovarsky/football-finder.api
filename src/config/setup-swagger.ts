import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { ApiConfigService } from "src/common/services/api-config.service";

export function setupSwagger(app: INestApplication, config: ApiConfigService) {
  const configSwaggerDocument = new DocumentBuilder()
    .setTitle(config.swagger.title)
    .setDescription(`${config.swagger.description}`)
    .setVersion(config.swagger.version)
    .addBearerAuth()
    .addApiKey({ type: "apiKey", name: "X-API-KEY", in: "header" }, "apiKey")
    .build();

  const document = SwaggerModule.createDocument(app, configSwaggerDocument);
  SwaggerModule.setup(config.api.prefix, app, document);
}
