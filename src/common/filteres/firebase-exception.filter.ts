import { Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Response } from "express";
import { FirebaseError } from "../interceptors";

@Catch(FirebaseError)
export class FirebaseExceptionsFilter extends BaseExceptionFilter {
  catch(exception: FirebaseError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      errors: exception.message,
    });

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      timestamp: new Date().toISOString(),
      errors: exception.message,
    });
  }
}
