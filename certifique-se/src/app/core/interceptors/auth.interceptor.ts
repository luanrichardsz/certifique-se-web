import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token() || localStorage.getItem("token");

  // Do not send Authorization token to public endpoints
  const isPublicAuthEndpoint =
    (req.method === "POST" && (req.url.endsWith("/usuarios") || req.url.includes("/auth/"))) ||
    (req.method === "GET" && req.url.includes("/public/"));

  let authReq = req;
  if (token && !isPublicAuthEndpoint && req.url.startsWith(environment.apiUrl)) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes("/auth/login") && !req.url.includes("/usuarios")) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
