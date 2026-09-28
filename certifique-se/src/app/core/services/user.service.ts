import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { User, UserUpdateDTO, ChangePasswordDTO } from "../models/user.model";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private http = inject(HttpClient);

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/usuarios/me`);
  }

  updateProfile(dto: UserUpdateDTO): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/usuarios/me`, dto);
  }

  uploadAvatar(file: File): Observable<User> {
    const formData = new FormData();
    formData.append("arquivo", file);
    return this.http.post<User>(`${environment.apiUrl}/usuarios/me/foto`, formData);
  }

  deleteAvatar(): Observable<User> {
    return this.http.delete<User>(`${environment.apiUrl}/usuarios/me/foto`);
  }

  resolveAvatarUrl(url: string | null | undefined): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `${environment.apiUrl}${url}`;
    }
    return `${environment.apiUrl}/${url}`;
  }

  changePassword(dto: ChangePasswordDTO): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/usuarios/me/senha`, dto);
  }

  deleteAccount(senhaAtual: string): Observable<void> {
    return this.http.request<void>("delete", `${environment.apiUrl}/usuarios/me`, {
      body: { senhaAtual }
    });
  }
}
