import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-firebase-jwt";
import { FirebaseAuthService } from "src/common/services";

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, "firebase-jwt") {
  constructor(private firebaseAuthService: FirebaseAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string) {
    return await this.firebaseAuthService.verifyToken(token);
  }
}
