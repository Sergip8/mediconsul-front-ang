import {inject, Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";



import { Token } from "@angular/compiler";
import { Router } from "@angular/router";
import { AuthService } from "../../public/views/auth/auth.service";

@Injectable()

export class RequestsInterceptor implements HttpInterceptor {
    constructor() {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const requestUrl: string = "http://localhost:7071/api/" + request.url;
        const authToken = localStorage.getItem("token")

        if(authToken) {
            request = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + authToken)
            });
        }

        request = request.clone({ url: requestUrl });

        return next.handle(request);
    }
}

export const interceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService)
  const authToken = authService.getToken();

  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  // Pass the cloned request with the updated header to the next handler
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.removeToken()
       
        // Redirect to home if unauthorized
        router.navigate(['']);
      }
      // Re-throw the error to propagate it further
      return throwError(() => error);
    })
  );
};