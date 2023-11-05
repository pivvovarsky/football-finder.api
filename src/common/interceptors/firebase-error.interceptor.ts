import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { FirebaseError } from "./errors/firebase.error";

@Injectable()
export class FirebaseErrorInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: any) => {
        if (["auth"].indexOf(error?.errorInfo?.code?.split("/")?.[0]) > -1) {
          throw new FirebaseError(error?.message);
        }
        throw error;
      }),
    );
  }
}
