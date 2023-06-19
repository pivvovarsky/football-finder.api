import { Injectable } from "@nestjs/common";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";

@Injectable()
export class AppService {
  constructor(private mongoPrismaSerivce: MongoPrismaService) {}
  getHello(): string {
    return "Hello World!";
  }

  async getApiKeyUsage(): Promise<{ API_KEY_USAGE_COUNT: number | null }> {
    const apiKeyUsageCount = await this.mongoPrismaSerivce.appStatistics.findFirst();
    return await { API_KEY_USAGE_COUNT: apiKeyUsageCount?.apiKeyUsage ?? null };
  }
}
