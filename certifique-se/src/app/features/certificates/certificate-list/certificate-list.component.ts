import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CertificateService } from "../../../core/services/certificate.service";
import { Certificate, CertificateFilterDTO } from "../../../core/models/certificate.model";
import { CertificateCardComponent } from "../../../shared/components/certificate-card/certificate-card.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";

@Component({
  selector: "app-certificate-list",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CertificateCardComponent, EmptyStateComponent],
  templateUrl: "./certificate-list.component.html",
  styleUrl: "./certificate-list.component.css"
})
export class CertificateListComponent implements OnInit {
  private certificateService = inject(CertificateService);

  certificates: Certificate[] = [];
  isLoading = true;

  // Filters
  searchQuery = "";
  selectedInstitution = "";
  selectedTag = "";
  visibilityFilter: "all" | "public" | "private" = "all";

  get institutions(): string[] {
    const list = this.certificates.map((c) => c.empresa.trim()).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }

  get allTags(): string[] {
    const tags = this.certificates.flatMap((c) => c.tags || []);
    return Array.from(new Set(tags)).sort();
  }

  get filteredCertificates(): Certificate[] {
    return this.certificates.filter((cert) => {
      // Search text
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const matchesName = cert.nome.toLowerCase().includes(query);
        const matchesEmpresa = cert.empresa.toLowerCase().includes(query);
        const matchesTags = cert.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesEmpresa && !matchesTags) return false;
      }

      // Institution
      if (this.selectedInstitution && cert.empresa.toLowerCase() !== this.selectedInstitution.toLowerCase()) {
        return false;
      }

      // Tag
      if (this.selectedTag && !cert.tags.includes(this.selectedTag)) {
        return false;
      }

      // Visibility
      if (this.visibilityFilter === "public" && !cert.publico) return false;
      if (this.visibilityFilter === "private" && cert.publico) return false;

      return true;
    });
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

  clearFilters(): void {
    this.searchQuery = "";
    this.selectedInstitution = "";
    this.selectedTag = "";
    this.visibilityFilter = "all";
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
