import { ApiConfigService } from "src/common/services/api-config.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { IConfig } from "src/config/config.interface";
import { FirebaseService } from "src/common/services/firebase/firebase.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { MailerService, MailerTransportFactory } from "@nestjs-modules/mailer";
import { TransportType } from "@nestjs-modules/mailer/dist/interfaces/mailer-options.interface";
import * as nodemailerMock from "nodemailer-mock";
import { FirebaseAuthService } from "src/common/services/firebase/firebase-auth.service";
import { AuthPayload } from "./models/auth-payload.model";
jest.mock("@nestjs/config");
jest.mock("src/common/services/mongo-prisma.service.ts");
jest.mock("src/common/services/api-config.service.ts");
jest.mock("src/common/services/firebase/firebase-storage.service.ts");
jest.mock("src/common/services/firebase/firebase.service.ts");
jest.mock("src/common/services/firebase/firebase-auth.service.ts");
jest.mock("@nestjs-modules/mailer");
jest.mock("firebase-admin");

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  class TestTransportFactory implements MailerTransportFactory {
    createTransport(options?: TransportType) {
      return nodemailerMock.createTransport({ host: "localhost", port: -100 });
    }
  }

  beforeEach(async () => {
    const apiConfigService = new ApiConfigService(new ConfigService<IConfig, true>());
    const firebaseService = new FirebaseService(apiConfigService);
    const firebaseAuthService = new FirebaseAuthService(firebaseService);
    const prismaService = new MongoPrismaService();
    const mailerService = new MailerService(apiConfigService.mailer, new TestTransportFactory());

    authService = new AuthService(prismaService, firebaseAuthService, mailerService, apiConfigService);

    authController = new AuthController(authService);
  });

  describe("forgotPassword", () => {
    it("should send forgot password email", async () => {
      const forgotPasswordDto = { email: "test@example.com" };

      jest.spyOn(authService, "sendMail").mockImplementation();

      await authController.forgotPassword(forgotPasswordDto);

      expect(authService.sendMail).toHaveBeenCalledWith("forgotPassword", forgotPasswordDto.email);
    });
  });

  describe("login", () => {
    it("should perform login", async () => {
      const loginDto = { email: "test@example.com", password: "password" };
      const authPayload: { email: string; name: string; emailVerified: true; token: string } = {
        email: "test@example.com",
        name: "test",
        emailVerified: true,
        token: "test",
      };

      jest.spyOn(authService, "login").mockResolvedValue(authPayload);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toBe(authPayload);
    });
  });

  describe("changePassword", () => {
    it("should change user password", async () => {
      const authPayload = { uid: "123", email: "test@test.pl", name: "test", email_verified: true };
      const changePasswordDto = { password: "newpassword" };

      jest.spyOn(authService, "changePassword").mockImplementation();

      await authController.changePassword(authPayload, changePasswordDto);

      expect(authService.changePassword).toHaveBeenCalledWith({
        id: authPayload.uid,
        newPassword: changePasswordDto.password,
      });
    });
  });
});
