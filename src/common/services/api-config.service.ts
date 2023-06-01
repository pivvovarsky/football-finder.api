import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IConfig } from "src/config/config.interface";

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService<IConfig, true>) {}

  get api(): IConfig["api"] {
    return this.configService.get("api");
  }

  get firebase(): IConfig["firebase"] {
    return this.configService.get("firebase");
  }

  get swagger(): IConfig["swagger"] {
    return this.configService.get("swagger");
  }

  get mailer(): IConfig["mailer"] {
    return this.configService.get("mailer");
  }
}
