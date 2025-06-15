import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {Inject, Injectable, inject} from "@angular/core";
import {catchError, Observable, retry, throwError, timer} from "rxjs";
import {NOTYF} from "../../shared/utils/notyf.token";

import {IError} from "../../shared/interfaces/error.interface";
import { Notyf } from "notyf";
import { Router } from "@angular/router";

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  constructor(@Inject(NOTYF) private notyf: Notyf, @Inject(Router) private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.notyf.dismissAll();
    
    return next.handle(request).pipe(
      retry({
        count: 3, delay: (errors: HttpErrorResponse, retryCount) =>
          this.shouldRetry(errors, retryCount)
      }),
      catchError((errors: HttpErrorResponse) => {
        let errorMessage = "The server is not ready to process your request.";

        if (errors.status != 0)
          errorMessage = errors.error.title;

        if (errors.status >= 400 && errors.status <= 415){
          this.router.navigate(['unauthorized']);
          return throwError(() => this.handleFormErrors(errors.error));

        }
        
        this.notyf.error({
          message: errorMessage,
          duration: 0
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private shouldRetry(errors: HttpErrorResponse, retryCount: number) {
    if (errors.status == 400)
      return throwError(() => errors);

    return timer(retryCount * 1000);
  }

  private handleFormErrors(errors: IError[]) {
    let errorMessages: any = {};

    errors.forEach((err: IError) => {
      const {title, message} = err;

      if (errorMessages[title.toLowerCase()])
        errorMessages[title.toLowerCase()].push(message);
      else
        errorMessages[title.toLowerCase()] = [message];
    });

    return errorMessages;
  }
}

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router: Router = inject(Router);
  
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 0:
          console.log("Network error");
          break;
        case 400:
          console.log("400 Bad Request. Server cannot process the request");
          break;
        case 401:
          router.navigateByUrl("unauthorized");
          console.log("401 Authentication Error");
          break;
        case 403:
          router.navigateByUrl("forbidden");
          console.log("403 Authentication Error");
          break;
        case 500:
          console.log("500 Internal Server Error");
          break;
        default:
          console.log(err.url);
          console.log(err.status + ", " + err.statusText);
          break;
      }
      //router.navigateByUrl("unauthorized");
      return throwError(() => new Error('An error occurred. Please try again later.'));
    })
  );
} 