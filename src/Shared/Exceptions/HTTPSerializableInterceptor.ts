import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { InvalidArgumentException } from './InvalidArgumentException';

@Injectable()
export class HTTPSerializableInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const httpSerializableException = new InvalidArgumentException('', '');
        const mapping = {
          400: BadRequestException,
          401: UnauthorizedException,
          422: UnprocessableEntityException,
        };

        if (
          httpSerializableException.getHttpCode.name in err &&
          httpSerializableException.getErrorMessages.name in err &&
          mapping[err.getHttpCode()]
        ) {
          throw new mapping[err.getHttpCode()](err.getErrorMessages());
        }
        return throwError(() => err);
      }),
    );
  }
}
