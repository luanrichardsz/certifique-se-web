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

  changePassword(dto: ChangePasswordDTO): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/usuarios/me/senha`, dto);
  }

  deleteAccount(senhaAtual: string): Observable<void> {
    return this.http.request<void>("delete", `${environment.apiUrl}/usuarios/me`, {
      body: { senhaAtual }
    });
  }
}
