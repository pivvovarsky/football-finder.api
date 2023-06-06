/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException } from "@nestjs/common";
import firebase from "firebase-admin";
import { FirebaseService } from "./firebase.service";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

@Injectable()
export class FirebaseAuthService {
  auth: firebase.auth.Auth;

  constructor(firebaseService: FirebaseService) {
    this.auth = firebaseService.getFirebaseAuth();
  }

  public async verifyToken(token: string): Promise<DecodedIdToken> {
    const firebaseUser = await this.auth.verifyIdToken(token, true);
    if (!firebaseUser || !firebaseUser.email_verified) {
      throw new UnauthorizedException();
    }
    return firebaseUser;
  }
}
