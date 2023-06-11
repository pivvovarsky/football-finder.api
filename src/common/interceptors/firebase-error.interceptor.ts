/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, Observable } from "rxjs";

export class FirebaseError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = FirebaseError.name;
  }
}

@Injectable()
export class FirebaseErrorInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: any) => {
        if (["auth"].indexOf(error?.errorInfo?.code?.split("/")?.[0]) > -1) {
          throw new FirebaseError(error?.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
