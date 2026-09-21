import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CertificateService } from "../../../core/services/certificate.service";
import { PdfThumbnailService } from "../../../core/services/pdf-thumbnail.service";
import { Certificate, CertificateUpdateDTO } from "../../../core/models/certificate.model";

@Component({
  selector: "app-certificate-edit",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./certificate-edit.component.html",
  styleUrl: "./certificate-edit.component.css"
})
export class CertificateEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private certificateService = inject(CertificateService);
  private pdfThumbnailService = inject(PdfThumbnailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  hashCertificado = "";
  certificate: Certificate | null = null;
  isLoading = true;
  isSaving = false;
  isUploadingImage = false;
  errorMessage: string | null = null;
  imageUploadError: string | null = null;
  imagePreviewUrl: string | null = null;

  certificateForm: FormGroup = this.fb.group({
    nome: ["", [Validators.required, Validators.maxLength(150)]],
    empresa: ["", [Validators.required, Validators.maxLength(150)]],
    dataConclusao: ["", [Validators.required]],
    cargaHoraria: [null, [Validators.min(1)]],
    linkValidacao: ["", [Validators.maxLength(500)]],
    foto: ["", [Validators.required]],
    descricao: ["", [Validators.maxLength(2000)]],
    tagsInput: ["", [Validators.required]],
    publico: [true]
  });

  ngOnInit(): void {
    this.hashCertificado = this.route.snapshot.params["hash"];
    this.loadCertificate();
  }

  loadCertificate(): void {
    this.isLoading = true;
    this.certificateService.getMyCertificates().subscribe({
      next: (list) => {
        const found = list.find((c) => c.hashCertificado === this.hashCertificado);
        if (found) {
          this.certificate = found;
          const resolved = this.certificateService.resolveImageUrl(found.foto);
          this.certificateForm.patchValue({
            nome: found.nome,
            empresa: found.empresa,
            dataConclusao: found.dataConclusao,
            cargaHoraria: found.cargaHoraria,
            linkValidacao: found.linkValidacao || "",
            foto: found.foto,
            descricao: found.descricao || "",
            tagsInput: found.tags.join(", "),
            publico: found.publico
          });

          if (found.foto && found.foto.toLowerCase().includes(".pdf")) {
            this.pdfThumbnailService.generateThumbnail(resolved)
              .then((thumb) => (this.imagePreviewUrl = thumb))
              .catch(() => (this.imagePreviewUrl = resolved));
          } else {
            this.imagePreviewUrl = resolved;
          }
        } else {
          this.errorMessage = "Certificado não encontrado.";
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "Erro ao carregar dados do certificado.";
      }
    });
  }

  get isPdf(): boolean {
    const url = this.certificateForm.get("foto")?.value || "";
    return !!url && (url.toLowerCase().includes(".pdf") || url.startsWith("data:application/pdf"));
  }

  onFotoUrlChange(): void {
    const url = this.certificateForm.get("foto")?.value;
    if (!url) {
      this.imagePreviewUrl = null;
      return;
    }
    const resolved = this.certificateService.resolveImageUrl(url);
    if (url.toLowerCase().includes(".pdf")) {
      this.pdfThumbnailService.generateThumbnail(resolved)
        .then((thumb) => (this.imagePreviewUrl = thumb))
        .catch(() => (this.imagePreviewUrl = null));
    } else {
      this.imagePreviewUrl = resolved;
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        this.imageUploadError = "O arquivo deve ter no máximo 5 MB.";
        return;
      }

      this.isUploadingImage = true;
      this.imageUploadError = null;

      const isPdfFile = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

      if (isPdfFile) {
        this.pdfThumbnailService.generateThumbnail(file)
          .then((thumb) => (this.imagePreviewUrl = thumb))
          .catch((err) => console.warn("Falha ao gerar miniatura:", err));
      } else {
        this.imagePreviewUrl = URL.createObjectURL(file);
      }

      this.certificateService.uploadImage(file).subscribe({
        next: (res) => {
          this.isUploadingImage = false;
          this.certificateForm.patchValue({ foto: res.url });
          if (!isPdfFile) {
            this.imagePreviewUrl = this.certificateService.resolveImageUrl(res.url);
          }
        },
        error: (err) => {
          this.isUploadingImage = false;
          console.error("Erro ao fazer upload do arquivo no Cloudflare R2:", err);
          this.imageUploadError = err.error?.detail || err.error?.mensagem || "Falha ao enviar arquivo. Formatos suportados: PNG, JPEG, WebP ou PDF (máx 5MB).";
        }
      });
    }
  }

  onSubmit(): void {
    if (this.certificateForm.invalid) {
      this.certificateForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const raw = this.certificateForm.value;
    const tags = raw.tagsInput
      .split(",")
      .map((t: string) => t.trim().toLowerCase())
      .filter((t: string) => t.length > 0);

    if (tags.length === 0) {
      this.errorMessage = "Informe pelo menos uma tag.";
      this.isSaving = false;
      return;
    }

    const payload: CertificateUpdateDTO = {
      nome: raw.nome.trim(),
      empresa: raw.empresa.trim(),
      dataConclusao: raw.dataConclusao,
      foto: raw.foto.trim(),
      tags: tags,
      cargaHoraria: raw.cargaHoraria ? Number(raw.cargaHoraria) : null,
      descricao: raw.descricao ? raw.descricao.trim() : null,
      linkValidacao: raw.linkValidacao ? raw.linkValidacao.trim() : null,
      publico: raw.publico
    };

    this.certificateService.updateCertificate(this.hashCertificado, payload).subscribe({
      next: () => {
        this.router.navigate(["/certificados", this.hashCertificado]);
      },
      error: (err) => {
        this.isSaving = false;
        console.error("Erro ao atualizar certificado:", err);
        if (err.status === 409) {
          this.errorMessage = err.error?.detail || err.error?.mensagem || "Já existe um certificado com estes dados.";
        } else if (err.error?.detail) {
          this.errorMessage = err.error.detail;
        } else if (err.error?.mensagem) {
          this.errorMessage = err.error.mensagem;
        } else {
          this.errorMessage = "Erro ao atualizar certificado. Verifique os campos.";
        }
      }
    });
  }
}
