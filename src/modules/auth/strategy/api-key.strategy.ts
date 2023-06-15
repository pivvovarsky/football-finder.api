import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import Strategy from "passport-headerapikey";
import { ApiConfigService } from "src/common/services/api-config.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "api-key") {
  constructor(private readonly config: ApiConfigService, private readonly mongoPrismaService: MongoPrismaService) {
    super({ header: "X-API-KEY", prefix: "" }, false);
  }

  public async validate(apiKey: string): Promise<boolean> {
    if (this.config.apiKey === apiKey) {
      await this.mongoPrismaService.appStatistics.update({
        where: { id: "648a5181d3ce8be4d513b36d" },
        data: { apiKeyUsage: { increment: 1 } },
      });
      return true;
    }
    throw new UnauthorizedException();
  }
}
