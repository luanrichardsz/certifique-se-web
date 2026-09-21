import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap, catchError, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { User } from "../models/user.model";
import { LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from "../models/auth.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = "token";
  private readonly USER_KEY = "currentUser";

  currentUser = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  isAuthenticated = computed(() => !!this.token() && !!this.currentUser());

  constructor() {
    if (this.token() && !this.currentUser()) {
      this.loadCurrentUser().subscribe();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        this.setToken(res.token);
      })
    );
  }

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${environment.apiUrl}/usuarios/me`).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/usuarios`, data);
  }

  forgotPassword(email: string): Observable<{ mensagem?: string }> {
    return this.http.post<{ mensagem?: string }>(`${environment.apiUrl}/auth/esqueci-senha`, { email });
  }

  resetPassword(data: ResetPasswordRequest): Observable<{ mensagem?: string }> {
    return this.http.post<{ mensagem?: string }>(`${environment.apiUrl}/auth/redefinir-senha`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(["/login"]);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.token.set(token);
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
