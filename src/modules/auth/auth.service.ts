import { MailerService } from "@nestjs-modules/mailer";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Operation } from "src/common/enums/Operation";
import { ApiConfigService } from "src/common/services/api-config.service";
import { FirebaseAuthService } from "src/common/services/firebase/firebase-auth.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import axios from "axios";
import { User } from "src/generated/prisma/client/mongo";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: MongoPrismaService,
    private firebaseAuthSerivce: FirebaseAuthService,
    private mailerService: MailerService,
    private apiConfigService: ApiConfigService,
    private readonly logger: Logger,
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
    const { email, password, firstName, lastName } = data;
    const userExists = await this.prismaService.user.findFirst({ where: { email } });
    if (userExists) throw new ConflictException("User with this email already exists");

    let firebaseUserId: string | null = null;
    let prismaUser: User | null = null;

    try {
      firebaseUserId = await this.firebaseAuthSerivce.createUser({ email, password, firstName, lastName });
      prismaUser = await this.prismaService.user.create({
        data: {
          id: firebaseUserId,
          email,
        },
      });
    } catch (error) {
      if (firebaseUserId) {
        console.log(firebaseUserId);
        await this.firebaseAuthSerivce.deleteUser(firebaseUserId);
      }
      const operation = firebaseUserId ? "Prisma" : "Firebase";
      throw new InternalServerErrorException(`Failed to create ${operation} user`);
    }

    return prismaUser;
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
            name: firebaseUser.email,
            link: activationLink,
          },
        })
        .then(() => {
          this.logger.debug("mail sent", firebaseUser.email);
        })
        .catch((error) => {
          this.logger.error("error", error);
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
            name: firebaseUser.email,
            link: activationLink,
          },
        })
        .then(() => {
          this.logger.debug("mail sent", firebaseUser.email);
        })
        .catch((error) => {
          this.logger.error("error", error, firebaseUser.email);
        });
    } else throw new NotFoundException();
  }

  public async changePassword(data: { id: string; newPassword: string }): Promise<void> {
    await this.firebaseAuthSerivce.changePassword(data);
  }

  public async login(body: { email: string; password: string }) {
    try {
      const key = this.apiConfigService.firebase.key;
      const url = this.apiConfigService.firebase.loginUrl;

      const response = await axios
        .post(
          url,
          { ...body, returnSecureToken: true },
          {
            params: {
              key: key,
            },
          },
        )
        .catch((error) => {
          throw new BadRequestException(`Error during authentication: ${error.message}`);
        });

      if (!response || !response.data || !response.data.localId) {
        throw new InternalServerErrorException("Invalid response from server");
      }

      const firebaseUser = await this.firebaseAuthSerivce.getUser(response.data.localId);
      if (!firebaseUser.emailVerified) {
        throw new UnauthorizedException("Email is not verified");
      } else {
        return {
          email: response.data.email,
          emailVerified: firebaseUser.emailVerified,
          token: response.data.idToken,
        };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
