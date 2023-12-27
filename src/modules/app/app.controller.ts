import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("app")
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Api health check" })
  @Get("api-check")
  getHello(): string {
    return this.appService.getHello();
  }
}
