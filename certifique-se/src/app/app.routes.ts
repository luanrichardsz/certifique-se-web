import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { guestGuard } from "./core/guards/guest.guard";

export const routes: Routes = [
  // Public Landing
  {
    path: "",
    loadComponent: () => import("./features/landing/landing.component").then((m) => m.LandingComponent)
  },

  // Public Profile / Portfolio (/u/:username)
  {
    path: "u/:username",
    loadComponent: () => import("./features/public-profile/public-profile.component").then((m) => m.PublicProfileComponent)
  },

  // Auth (Guest Only)
  {
    path: "login",
    canActivate: [guestGuard],
    loadComponent: () => import("./features/auth/login/login.component").then((m) => m.LoginComponent)
  },
  {
    path: "cadastro",
    canActivate: [guestGuard],
    loadComponent: () => import("./features/auth/register/register.component").then((m) => m.RegisterComponent)
  },
  {
    path: "esqueci-senha",
    canActivate: [guestGuard],
    loadComponent: () => import("./features/auth/forgot-password/forgot-password.component").then((m) => m.ForgotPasswordComponent)
  },
  {
    path: "redefinir-senha",
    canActivate: [guestGuard],
    loadComponent: () => import("./features/auth/reset-password/reset-password.component").then((m) => m.ResetPasswordComponent)
  },

  // Authenticated App
  {
    path: "dashboard",
    canActivate: [authGuard],
    loadComponent: () => import("./features/dashboard/dashboard.component").then((m) => m.DashboardComponent)
  },
  {
    path: "certificados",
    canActivate: [authGuard],
    loadComponent: () => import("./features/certificates/certificate-list/certificate-list.component").then((m) => m.CertificateListComponent)
  },
  {
    path: "certificados/novo",
    canActivate: [authGuard],
    loadComponent: () => import("./features/certificates/certificate-new/certificate-new.component").then((m) => m.CertificateNewComponent)
  },
  {
    path: "certificados/:hash",
    canActivate: [authGuard],
    loadComponent: () => import("./features/certificates/certificate-detail/certificate-detail.component").then((m) => m.CertificateDetailComponent)
  },
  {
    path: "certificados/:hash/editar",
    canActivate: [authGuard],
    loadComponent: () => import("./features/certificates/certificate-edit/certificate-edit.component").then((m) => m.CertificateEditComponent)
  },
  {
    path: "perfil",
    canActivate: [authGuard],
    loadComponent: () => import("./features/profile/profile.component").then((m) => m.ProfileComponent)
  },

  // Fallback
  {
    path: "**",
    redirectTo: ""
  }
];
