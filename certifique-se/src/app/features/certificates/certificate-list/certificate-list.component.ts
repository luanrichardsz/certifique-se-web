import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CertificateService } from "../../../core/services/certificate.service";
import { Certificate } from "../../../core/models/certificate.model";
import { CertificateCardComponent } from "../../../shared/components/certificate-card/certificate-card.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { extractApiErrorMessage } from "../../../core/utils/api-error.util";

@Component({
  selector: "app-certificate-list",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CertificateCardComponent, EmptyStateComponent, ModalComponent],
  templateUrl: "./certificate-list.component.html",
  styleUrl: "./certificate-list.component.css"
})
export class CertificateListComponent implements OnInit {
  private certificateService = inject(CertificateService);

  certificates: Certificate[] = [];
  isLoading = true;
  loadError: string | null = null;

  // Filters & Sorting
  searchQuery = "";
  selectedInstitution = "";
  selectedTag = "";
  selectedYear = "";
  visibilityFilter: "all" | "public" | "private" = "all";
  sortBy: "recent" | "oldest" | "hours" | "name" = "recent";
  showMobileFilters = false;

  // Delete Modal State
  certToDelete: Certificate | null = null;
  isDeleting = false;
  deleteError: string | null = null;

  get activeFiltersCount(): number {
    let count = 0;
    if (this.selectedInstitution) count++;
    if (this.selectedTag) count++;
    if (this.selectedYear) count++;
    if (this.visibilityFilter !== "all") count++;
    if (this.sortBy !== "recent") count++;
    return count;
  }

  get institutions(): string[] {
    const list = this.certificates.map((c) => c.empresa.trim()).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }

  get allTags(): string[] {
    const tags = this.certificates.flatMap((c) => c.tags || []);
    return Array.from(new Set(tags)).sort();
  }

  get availableYears(): string[] {
    const years = this.certificates
      .map((c) => (c.dataConclusao ? c.dataConclusao.slice(0, 4) : ""))
      .filter((y) => /^\d{4}$/.test(y));
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }

  get filteredCertificates(): Certificate[] {
    const filtered = this.certificates.filter((cert) => {
      // Search text
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const matchesName = cert.nome.toLowerCase().includes(query);
        const matchesEmpresa = cert.empresa.toLowerCase().includes(query);
        const matchesTags = (cert.tags || []).some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesEmpresa && !matchesTags) return false;
      }

      // Institution
      if (this.selectedInstitution && cert.empresa.toLowerCase() !== this.selectedInstitution.toLowerCase()) {
        return false;
      }

      // Tag
      if (this.selectedTag && !(cert.tags || []).includes(this.selectedTag)) {
        return false;
      }

      // Year
      if (this.selectedYear && (!cert.dataConclusao || !cert.dataConclusao.startsWith(this.selectedYear))) {
        return false;
      }

      // Visibility
      if (this.visibilityFilter === "public" && !cert.publico) return false;
      if (this.visibilityFilter === "private" && cert.publico) return false;

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (this.sortBy === "oldest") {
        return (a.dataConclusao || "").localeCompare(b.dataConclusao || "");
      }
      if (this.sortBy === "hours") {
        return (b.cargaHoraria || 0) - (a.cargaHoraria || 0);
      }
      if (this.sortBy === "name") {
        return (a.nome || "").localeCompare(b.nome || "", "pt-BR");
      }
      // Default: "recent"
      const dateCmp = (b.dataConclusao || "").localeCompare(a.dataConclusao || "");
      if (dateCmp !== 0) return dateCmp;
      return (b.idCertificado || 0) - (a.idCertificado || 0);
    });
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
        this.loadError = extractApiErrorMessage(err, "Não foi possível carregar seus certificados no momento.");
      }
    });
  }

  clearFilters(): void {
    this.searchQuery = "";
    this.selectedInstitution = "";
    this.selectedTag = "";
    this.selectedYear = "";
    this.visibilityFilter = "all";
    this.sortBy = "recent";
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
