import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import Strategy from "passport-headerapikey";
import { ApiConfigService } from "src/common/services/api-config.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "api-key") {
  constructor(private readonly config: ApiConfigService) {
    super({ header: "X-API-KEY", prefix: "" }, false);
  }

  public validate(apiKey: string): boolean {
    if (this.config.apiKey === apiKey) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
