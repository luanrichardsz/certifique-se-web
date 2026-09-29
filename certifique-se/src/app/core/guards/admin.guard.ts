import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { map, of } from "rxjs";
import { AuthService } from "../services/auth.service";

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.token()) {
    router.navigate(["/login"]);
    return false;
  }

  const currentUser = authService.currentUser();
  if (currentUser) {
    if (currentUser.role === "ADMIN") {
      return true;
    }
    router.navigate(["/dashboard"]);
    return false;
  }

  return authService.loadCurrentUser().pipe(
    map((user) => {
      if (user && user.role === "ADMIN") {
        return true;
      }
      router.navigate(["/dashboard"]);
      return false;
    })
  );
};
