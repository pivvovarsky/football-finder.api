import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Operation } from "src/common/enums/Operation";
import { FirebaseAuthService } from "src/common/services/firebase/firebase-auth.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: MongoPrismaService,
    private firebaseAuthSerivce: FirebaseAuthService,
    private mailerService: MailerService,
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
    const { firstName, lastName } = data;

    const firebaseUser = await this.firebaseAuthSerivce.createUser(data);

    return await this.prismaService.user.create({
      data: {
        id: firebaseUser.uid,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
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
}
