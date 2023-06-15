import { Injectable } from "@nestjs/common";
import { ApiConfigService } from "src/common/services/api-config.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";

@Injectable()
export class AppService {
  constructor(private mongoPrismaSerivce: MongoPrismaService) {}
  getHello(): string {
    return "Hello World!";
  }

  async getApiKeyUsage(): Promise<Object> {
    const apiKeyUsageCount = await this.mongoPrismaSerivce.appStatistics.findFirst();
    return await { API_KEY_USAGE_COUNT: apiKeyUsageCount?.apiKeyUsage };
  }
}
