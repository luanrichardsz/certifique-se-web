import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CertificateService } from "../../../core/services/certificate.service";
import { PdfThumbnailService } from "../../../core/services/pdf-thumbnail.service";
import { Certificate } from "../../../core/models/certificate.model";
import { BadgeComponent } from "../../../shared/components/badge/badge.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { extractApiErrorMessage } from "../../../core/utils/api-error.util";

@Component({
  selector: "app-certificate-detail",
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, ModalComponent],
  templateUrl: "./certificate-detail.component.html",
  styleUrl: "./certificate-detail.component.css"
})
export class CertificateDetailComponent implements OnInit {
  private certificateService = inject(CertificateService);
  private pdfThumbnailService = inject(PdfThumbnailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  hashCertificado = "";
  certificate: Certificate | null = null;
  isLoading = true;
  loadError: string | null = null;
  pdfThumbnailUrl: string | null = null;
  isLoadingPdfThumb = false;

  // Delete Modal State
  showDeleteModal = false;
  isDeleting = false;
  deleteError: string | null = null;

  get isPdf(): boolean {
    const url = this.certificate?.foto;
    return !!url && url.toLowerCase().includes(".pdf");
  }

  get fotoUrl(): string {
    return this.certificateService.resolveImageUrl(this.certificate?.foto);
  }

  get formattedDate(): string {
    if (!this.certificate?.dataConclusao) return "";
    try {
      const [year, month, day] = this.certificate.dataConclusao.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return this.certificate.dataConclusao;
    }
  }

  ngOnInit(): void {
    this.hashCertificado = this.route.snapshot.params["hash"];
    this.loadCertificate();
  }

  loadCertificate(): void {
    this.isLoading = true;
    this.loadError = null;
    this.certificateService.getMyCertificates().subscribe({
      next: (list) => {
        this.certificate = list.find((c) => c.hashCertificado === this.hashCertificado) || null;
        this.isLoading = false;

        if (this.certificate && this.isPdf) {
          this.isLoadingPdfThumb = true;
          this.pdfThumbnailService.generateThumbnail(this.fotoUrl, 2.0)
            .then((thumb) => {
              this.pdfThumbnailUrl = thumb;
              this.isLoadingPdfThumb = false;
            })
            .catch((err) => {
              console.warn("Falha ao renderizar capa do PDF:", err);
              this.isLoadingPdfThumb = false;
            });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loadError = extractApiErrorMessage(err, "Não foi possível carregar os detalhes do certificado.");
      }
    });
  }

  openDeleteModal(): void {
    this.deleteError = null;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    if (this.isDeleting) return;
    this.showDeleteModal = false;
    this.deleteError = null;
  }

  confirmDeleteCertificate(): void {
    if (!this.certificate || this.isDeleting) return;
    this.isDeleting = true;
    this.deleteError = null;

    this.certificateService.deleteCertificate(this.certificate.hashCertificado).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.router.navigate(["/certificados"]);
      },
      error: (err) => {
        this.isDeleting = false;
        this.deleteError = extractApiErrorMessage(err, "Erro ao excluir certificado. Tente novamente.");
      }
    });
  }
}
