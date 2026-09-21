import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PublicProfile, PublicCertificate } from "../models/public-profile.model";

@Injectable({
  providedIn: "root"
})
export class PublicService {
  private http = inject(HttpClient);

  getPublicProfile(username: string): Observable<PublicProfile> {
    return this.http.get<PublicProfile>(`${environment.apiUrl}/public/usuarios/${username}`);
  }

  getPublicCertificates(username: string): Observable<PublicCertificate[]> {
    return this.http.get<PublicCertificate[]>(`${environment.apiUrl}/public/usuarios/${username}/certificados`);
  }
}
