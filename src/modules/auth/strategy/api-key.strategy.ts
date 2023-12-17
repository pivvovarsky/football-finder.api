import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import Strategy from "passport-headerapikey";
import { ApiConfigService } from "src/common/services/api-config.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "api-key") {
  constructor(private readonly config: ApiConfigService, private readonly mongoPrismaService: MongoPrismaService) {
    super({ header: "X-API-KEY", prefix: "" }, false);
  }
}
