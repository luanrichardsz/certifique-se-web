import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { CertificateService } from "../../core/services/certificate.service";
import { Certificate } from "../../core/models/certificate.model";
import { StatsCardComponent } from "../../shared/components/stats-card/stats-card.component";
import { CertificateCardComponent } from "../../shared/components/certificate-card/certificate-card.component";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterLink, StatsCardComponent, CertificateCardComponent, EmptyStateComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css"
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  certificateService = inject(CertificateService);

  currentUser = this.authService.currentUser;
  certificates: Certificate[] = [];
  isLoading = true;
  copied = false;

  get totalCertificates(): number {
    return this.certificates.length;
  }

  get totalHours(): number {
    return this.certificates.reduce((acc, c) => acc + (c.cargaHoraria || 0), 0);
  }

  get totalHoursFormatted(): string {
    return `${this.totalHours}h`;
  }

  get totalInstitutions(): number {
    const unique = new Set(this.certificates.map((c) => c.empresa.trim().toLowerCase()));
    return unique.size;
  }

  get totalPublic(): number {
    return this.certificates.filter((c) => c.publico).length;
  }

  get recentCertificates(): Certificate[] {
    return this.certificates.slice(0, 3);
  }

  get publicProfileUrl(): string {
    const username = this.currentUser()?.username;
    if (!username) return "";
    return `${window.location.origin}/u/${username}`;
  }

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.isLoading = true;
    this.certificateService.getMyCertificates().subscribe({
      next: (data) => {
        this.certificates = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.publicProfileUrl);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  onDelete(cert: Certificate): void {
    if (confirm(`Tem certeza que deseja excluir o certificado "${cert.nome}"?`)) {
      this.certificateService.deleteCertificate(cert.hashCertificado).subscribe({
        next: () => {
          this.certificates = this.certificates.filter((c) => c.hashCertificado !== cert.hashCertificado);
        }
      });
    }
  }
}
