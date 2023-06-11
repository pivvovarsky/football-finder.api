/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import firebase from "firebase-admin";
import { FirebaseService } from "./firebase.service";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

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

  public async createUser(body: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<UserRecord> {
    const { email, password, firstName, lastName } = body;

    const user = await this.auth.createUser({
      email,
      password,
      emailVerified: false,
      displayName: `${firstName ?? ""} ${lastName ?? ""}`,
    });

    return user;
  }

  public async getActivationLink(email: string): Promise<string> {
    return await this.auth.generateEmailVerificationLink(email);
  }

  public async getUserByEmail(email: string) {
    return await this.auth.getUserByEmail(email);
  }

  public async generateResetPasswordLink(email: string): Promise<string> {
    return await this.auth.generatePasswordResetLink(email);
  }

  public async changePassword(body: { id: string; newPassword: string }): Promise<void> {
    const { id, newPassword } = body;
    try {
      await this.auth.updateUser(id, {
        password: newPassword,
      });
    } catch (error: any) {
      throw new NotFoundException(error);
    }
  }
}
