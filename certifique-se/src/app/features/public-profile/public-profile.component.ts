import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PublicService } from "../../core/services/public.service";
import { UserService } from "../../core/services/user.service";
import { CertificateService } from "../../core/services/certificate.service";
import { PdfThumbnailService } from "../../core/services/pdf-thumbnail.service";
import { PublicProfile } from "../../core/models/public-profile.model";
import { CertificateCardComponent } from "../../shared/components/certificate-card/certificate-card.component";
import { Certificate } from "../../core/models/certificate.model";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";
import { ModalComponent } from "../../shared/components/modal/modal.component";

@Component({
  selector: "app-public-profile",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CertificateCardComponent, EmptyStateComponent, ModalComponent],
  templateUrl: "./public-profile.component.html",
  styleUrl: "./public-profile.component.css"
})
export class PublicProfileComponent implements OnInit {
  private publicService = inject(PublicService);
  private certificateService = inject(CertificateService);
  private pdfThumbnailService = inject(PdfThumbnailService);
  private route = inject(ActivatedRoute);
  userService = inject(UserService);
  imageError = false;

  onImageError(): void {
    this.imageError = true;
  }

  username = "";
  profile: PublicProfile | null = null;
  certificates: Certificate[] = [];
  isLoading = true;
  notFound = false;
  searchQuery = "";
  selectedTag = "";
  showFullBio = false;

  // Modal de detalhes do certificado público
  selectedCertificate: Certificate | null = null;
  selectedCertPdfThumb: string | null = null;
  isLoadingSelectedPdf = false;

  get userInitials(): string {
    if (!this.profile?.nomeUsuario) return "U";
    return this.profile.nomeUsuario
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  cleanBio(text: string): string {
    if (!text) return "";
    return text.replace(/[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, "").trim();
  }

  get allTags(): string[] {
    const tags = this.certificates.flatMap((c) => c.tags || []);
    return Array.from(new Set(tags)).sort();
  }

  get filteredCertificates(): Certificate[] {
    return this.certificates.filter((cert) => {
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = cert.nome.toLowerCase().includes(q);
        const matchesEmpresa = cert.empresa.toLowerCase().includes(q);
        const matchesTag = (cert.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesEmpresa && !matchesTag) return false;
      }
      if (this.selectedTag && !(cert.tags || []).includes(this.selectedTag)) {
        return false;
      }
      return true;
    });
  }

  ngOnInit(): void {
    this.username = this.route.snapshot.params["username"];
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.notFound = false;

    this.publicService.getPublicProfile(this.username).subscribe({
      next: (prof) => {
        this.profile = prof;
        this.loadCertificates();
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
      }
    });
  }

  loadCertificates(): void {
    this.publicService.getPublicCertificates(this.username).subscribe({
      next: (list) => {
        // Map PublicCertificate to Certificate interface
        this.certificates = list.map((c, index) => ({
          idCertificado: index,
          hashCertificado: c.hashCertificado,
          foto: c.foto,
          nome: c.nome,
          empresa: c.empresa,
          dataConclusao: c.dataConclusao,
          tags: c.tags || [],
          cargaHoraria: c.cargaHoraria,
          descricao: c.descricao,
          linkValidacao: c.linkValidacao,
          publico: true
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openCertificateModal(cert: Certificate): void {
    this.selectedCertificate = cert;
    this.selectedCertPdfThumb = null;
    this.isLoadingSelectedPdf = false;

    const fotoUrl = this.resolveCertUrl(cert.foto);
    if (cert.foto && cert.foto.toLowerCase().includes(".pdf")) {
      this.isLoadingSelectedPdf = true;
      this.pdfThumbnailService.generateThumbnail(fotoUrl, 2.0)
        .then((thumb) => {
          this.selectedCertPdfThumb = thumb;
          this.isLoadingSelectedPdf = false;
        })
        .catch(() => {
          this.isLoadingSelectedPdf = false;
        });
    }
  }

  closeCertificateModal(): void {
    this.selectedCertificate = null;
    this.selectedCertPdfThumb = null;
  }

  resolveCertUrl(foto: string | null | undefined): string {
    return this.certificateService.resolveImageUrl(foto);
  }

  isCertPdf(cert: Certificate | null): boolean {
    return !!cert?.foto && cert.foto.toLowerCase().includes(".pdf");
  }

  formatCertDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  }
}
