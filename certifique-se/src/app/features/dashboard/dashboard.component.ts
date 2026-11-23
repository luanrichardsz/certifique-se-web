import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { CertificateService } from "../../core/services/certificate.service";
import { UserService } from "../../core/services/user.service";
import { Certificate } from "../../core/models/certificate.model";
import { StatsCardComponent } from "../../shared/components/stats-card/stats-card.component";
import { CertificateCardComponent } from "../../shared/components/certificate-card/certificate-card.component";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";
import { ModalComponent } from "../../shared/components/modal/modal.component";
import { extractApiErrorMessage } from "../../core/utils/api-error.util";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterLink, StatsCardComponent, CertificateCardComponent, EmptyStateComponent, ModalComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css"
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  certificateService = inject(CertificateService);
  userService = inject(UserService);
  imageError = false;

  get userInitials(): string {
    const user = this.currentUser();
    if (!user || !user.nomeUsuario) return "U";
    return user.nomeUsuario.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  }

  currentUser = this.authService.currentUser;
  certificates: Certificate[] = [];
  isLoading = true;
  loadError: string | null = null;
  copied = false;

  // Delete Modal State
  certToDelete: Certificate | null = null;
  isDeleting = false;
  deleteError: string | null = null;

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
    return [...this.certificates]
      .sort((a, b) => {
        const idA = a.idCertificado || 0;
        const idB = b.idCertificado || 0;
        if (idB !== idA) {
          return idB - idA;
        }
        return (b.dataConclusao || "").localeCompare(a.dataConclusao || "");
      })
      .slice(0, 3);
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
    this.loadError = null;
    this.certificateService.getMyCertificates().subscribe({
      next: (data) => {
        this.certificates = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.loadError = extractApiErrorMessage(err, "Não foi possível carregar seus certificados.");
      }
    });
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.publicProfileUrl);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  onDelete(cert: Certificate): void {
    this.certToDelete = cert;
    this.deleteError = null;
  }

  closeDeleteModal(): void {
    if (this.isDeleting) return;
    this.certToDelete = null;
    this.deleteError = null;
  }

  confirmDelete(): void {
    if (!this.certToDelete || this.isDeleting) return;
    const target = this.certToDelete;
    this.isDeleting = true;
    this.deleteError = null;

    this.certificateService.deleteCertificate(target.hashCertificado).subscribe({
      next: () => {
        this.isDeleting = false;
        this.certificates = this.certificates.filter((c) => c.hashCertificado !== target.hashCertificado);
        this.certToDelete = null;
      },
      error: (err) => {
        this.isDeleting = false;
        this.deleteError = extractApiErrorMessage(err, "Erro ao excluir o certificado. Tente novamente.");
      }
    });
  }
}
