import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Certificate, CertificateRequestDTO, CertificateUpdateDTO, CertificateFilterDTO } from "../models/certificate.model";

@Injectable({
  providedIn: "root"
})
export class CertificateService {
  private http = inject(HttpClient);

  getMyCertificates(filter?: CertificateFilterDTO): Observable<Certificate[]> {
    let params = new HttpParams();
    if (filter?.nome) {
      params = params.set("nome", filter.nome);
    }
    if (filter?.empresa) {
      params = params.set("empresa", filter.empresa);
    }
    if (filter?.dataConclusao) {
      params = params.set("dataConclusao", filter.dataConclusao);
    }
    if (filter?.tags) {
      params = params.set("tags", filter.tags);
    }

    return this.http.get<Certificate[]>(`${environment.apiUrl}/certificados/me`, { params });
  }

  createCertificate(dto: CertificateRequestDTO): Observable<Certificate> {
    return this.http.post<Certificate>(`${environment.apiUrl}/certificados`, dto);
  }

  updateCertificate(hash: string, dto: CertificateUpdateDTO): Observable<Certificate> {
    return this.http.put<Certificate>(`${environment.apiUrl}/certificados/${hash}`, dto);
  }

  uploadImage(file: File): Observable<{ chave: string; url: string }> {
    const formData = new FormData();
    formData.append("arquivo", file);
    return this.http.post<{ chave: string; url: string }>(`${environment.apiUrl}/certificados/imagens`, formData);
  }

  resolveImageUrl(url: string | null | undefined): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `${environment.apiUrl}${url}`;
    }
    return `${environment.apiUrl}/${url}`;
  }

  deleteCertificate(hash: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/certificados/${hash}`);
  }
}
