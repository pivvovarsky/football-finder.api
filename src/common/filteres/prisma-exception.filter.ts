import { Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Response } from "express";
import { Prisma as PrismaMongo } from "../../generated/prisma/client/mongo";

@Catch(PrismaMongo.PrismaClientKnownRequestError)
export class PrismaExceptionsFilter extends BaseExceptionFilter {
  catch(exception: PrismaMongo.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case "P2003":
      case "P2002":
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          timestamp: new Date().toISOString(),
        });
        break;
      case "P1012":
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          errors: exception.message.replace(/\n/, ""),
        });
        break;
      case "P2025":
      case "P2001":
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          timestamp: new Date().toISOString(),
          errors: "Resource not Found!",
        });
        break;
      default:
        super.catch(exception, host);
    }
  }
}
