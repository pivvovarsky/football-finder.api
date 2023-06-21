import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Operation } from "src/common/enums/Operation";
import { ApiConfigService } from "src/common/services/api-config.service";
import { FirebaseAuthService } from "src/common/services/firebase/firebase-auth.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import axios from "axios";
import { BadRequestError } from "passport-headerapikey";
import { error } from "console";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: MongoPrismaService,
    private firebaseAuthSerivce: FirebaseAuthService,
    private mailerService: MailerService,
    private apiConfigService: ApiConfigService,
  ) {}

  public async sendMail(option: Operation, email: string) {
    switch (option) {
      case Operation.SignUp:
        return await this.sendActivationMail(email);
      case Operation.ForgotPassword:
        return await this.sendResetPasswordMail(email);
    }
  }

  public async signUp(data: { email: string; password: string; firstName?: string; lastName?: string }) {
    const { firstName, lastName, email } = data;

    const firebaseUserId = await this.firebaseAuthSerivce.createUser(data);

    return await this.prismaService.user.create({
      data: {
        id: firebaseUserId,
        email: email,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        settings: { create: {} },
      },
    });
  }

  private async sendActivationMail(email: string) {
    const firebaseUser = await this.firebaseAuthSerivce.getUserByEmail(email);
    if (!!firebaseUser.email) {
      const activationLink = await this.firebaseAuthSerivce.getActivationLink(firebaseUser.email);

      await this.mailerService
        .sendMail({
          to: firebaseUser.email,
          subject: "Football Finder - Activate your Account",
          template: "activate-account",
          context: {
            name: firebaseUser.displayName,
            link: activationLink,
          },
        })
        .then(() => {
          console.debug("mail sent");
        })
        .catch((error) => {
          console.error("error", error);
        });
    } else throw new NotFoundException();
  }

  private async sendResetPasswordMail(email: string) {
    const firebaseUser = await this.firebaseAuthSerivce.getUserByEmail(email);
    if (!!firebaseUser.email) {
      const activationLink = await this.firebaseAuthSerivce.generateResetPasswordLink(firebaseUser.email);

      await this.mailerService
        .sendMail({
          to: firebaseUser.email,
          subject: "Football Finder - Reset your account password",
          template: "reset-password",
          context: {
            name: firebaseUser.displayName,
            link: activationLink,
          },
        })
        .then(() => {
          console.debug("mail sent");
        })
        .catch((error) => {
          console.error("error", error);
        });
    } else throw new NotFoundException();
  }

  public async changePassword(data: { id: string; newPassword: string }): Promise<void> {
    await this.firebaseAuthSerivce.changePassword(data);
  }

  public async login(body: { email: string; password: string }) {
    const key = await this.apiConfigService.firebase.key;
    const url = " https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";
    const response = await axios.post(
      url,
      { ...body, returnSecureToken: true },
      {
        params: {
          key: key,
        },
      },
    );
    const firebaseUser = await this.firebaseAuthSerivce.getUser(response.data.localId);
    if (!firebaseUser) return;
    if (!firebaseUser.emailVerified) {
      throw new UnauthorizedException("Your email is not verified");
    } else {
      return {
        email: response.data.email,
        name: response.data.displayName,
        emailVerified: firebaseUser.emailVerified,
        token: response.data.idToken,
      };
    }
  }
}
