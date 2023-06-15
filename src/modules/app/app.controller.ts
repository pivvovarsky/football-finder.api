import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiKeyGuard } from "src/common/decorators/guards/api-key.decorator";

@ApiTags("app")
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiKeyGuard()
  @ApiOperation({ summary: "protected by api-key guard" })
  @Get("api-check")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/statistics/api-key")
  async getApiKeyStatistics() {
    return this.appService.getApiKeyUsage();
  }
}
