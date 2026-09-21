import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CertificateService } from "../../../core/services/certificate.service";
import { PdfThumbnailService } from "../../../core/services/pdf-thumbnail.service";
import { Certificate } from "../../../core/models/certificate.model";
import { BadgeComponent } from "../../../shared/components/badge/badge.component";

@Component({
  selector: "app-certificate-detail",
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent],
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
  copiedHash = false;
  pdfThumbnailUrl: string | null = null;
  isLoadingPdfThumb = false;

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
      error: () => {
        this.isLoading = false;
      }
    });
  }

  copyHash(): void {
    if (!this.certificate?.hashCertificado) return;
    navigator.clipboard.writeText(this.certificate.hashCertificado);
    this.copiedHash = true;
    setTimeout(() => (this.copiedHash = false), 2000);
  }

  deleteCertificate(): void {
    if (!this.certificate) return;
    if (confirm(`Tem certeza que deseja excluir o certificado "${this.certificate.nome}"? Esta ação não pode ser desfeita.`)) {
      this.certificateService.deleteCertificate(this.certificate.hashCertificado).subscribe({
        next: () => {
          this.router.navigate(["/certificados"]);
        }
      });
    }
  }
}
