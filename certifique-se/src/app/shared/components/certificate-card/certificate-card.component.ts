import { Component, Input, Output, EventEmitter, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Certificate } from "../../../core/models/certificate.model";
import { BadgeComponent } from "../badge/badge.component";
import { CertificateService } from "../../../core/services/certificate.service";
import { PdfThumbnailService } from "../../../core/services/pdf-thumbnail.service";

@Component({
  selector: "app-certificate-card",
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent],
  templateUrl: "./certificate-card.component.html",
  styleUrl: "./certificate-card.component.css"
})
export class CertificateCardComponent implements OnInit {
  private certificateService = inject(CertificateService);
  private pdfThumbnailService = inject(PdfThumbnailService);

  @Input({ required: true }) certificate!: Certificate;
  @Input() showActions = true;
  @Input() isPublicView = false;

  @Output() delete = new EventEmitter<Certificate>();

  imageError = false;
  pdfThumbnailUrl: string | null = null;
  isLoadingPdfThumb = false;

  get isPdf(): boolean {
    const url = this.certificate?.foto;
    return !!url && url.toLowerCase().includes(".pdf");
  }

  get fotoUrl(): string {
    return this.certificateService.resolveImageUrl(this.certificate?.foto);
  }

  ngOnInit(): void {
    if (this.isPdf) {
      this.loadPdfThumbnail();
    }
  }

  private loadPdfThumbnail(): void {
    this.isLoadingPdfThumb = true;
    this.pdfThumbnailService.generateThumbnail(this.fotoUrl)
      .then((thumb) => {
        this.pdfThumbnailUrl = thumb;
        this.isLoadingPdfThumb = false;
      })
      .catch((err) => {
        console.warn("Não foi possível gerar thumbnail do PDF:", err);
        this.isLoadingPdfThumb = false;
      });
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

  onImageError(): void {
    this.imageError = true;
  }

  onDelete(e: Event): void {
    e.stopPropagation();
    this.delete.emit(this.certificate);
  }
}
