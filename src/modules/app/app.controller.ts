import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { Public } from "src/common/decorators";
@ApiTags("app")
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get("api-check")
  getHello(): string {
    return this.appService.getHello();
  }
}
