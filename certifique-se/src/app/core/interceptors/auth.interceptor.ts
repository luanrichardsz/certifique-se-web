import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem("token");

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
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        router.navigate(["/login"]);
      }
      return throwError(() => error);
    })
  );
};
