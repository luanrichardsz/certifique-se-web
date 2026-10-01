import { Component, inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CertificateService } from "../../../core/services/certificate.service";
import { PdfThumbnailService } from "../../../core/services/pdf-thumbnail.service";
import { CertificateRequestDTO } from "../../../core/models/certificate.model";
import { CommonModule } from "@angular/common";

function pastOrPresentDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date().toISOString().split("T")[0];
  if (control.value > today) {
    return { futureDate: true };
  }
  return null;
}

@Component({
  selector: "app-certificate-new",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./certificate-new.component.html",
  styleUrl: "./certificate-new.component.css"
})
export class CertificateNewComponent {
  readonly maxDate: string = new Date().toISOString().split("T")[0];
  private fb = inject(FormBuilder);
  private certificateService = inject(CertificateService);
  private pdfThumbnailService = inject(PdfThumbnailService);
  private router = inject(Router);

  certificateForm: FormGroup = this.fb.group({
    nome: ["", [Validators.required, Validators.maxLength(150)]],
    empresa: ["", [Validators.required, Validators.maxLength(150)]],
    dataConclusao: ["", [Validators.required, pastOrPresentDateValidator]],
    cargaHoraria: [null, [Validators.min(1)]],
    linkValidacao: ["", [Validators.maxLength(500)]],
    foto: ["", [Validators.required]],
    descricao: ["", [Validators.maxLength(2000)]],
    tagsInput: ["", [Validators.required]],
    publico: [true]
  });

  tags: string[] = [];

  isLoading = false;
  isUploadingImage = false;
  isExtractingAi = false;
  aiSuccessFeedback: string | null = null;
  errorMessage: string | null = null;
  imageUploadError: string | null = null;
  imagePreviewUrl: string | null = null;

  // Mobile wizard stepper (only used on screens < md)
  mobileStep = 1;
  readonly totalSteps = 3;
  stepLabels = ["Arquivo", "Dados", "Detalhes"];

  get isMobile(): boolean {
    return typeof window !== "undefined" && window.innerWidth < 768;
  }

  get canGoNext(): boolean {
    if (this.mobileStep === 1) {
      const foto = this.certificateForm.get("foto");
      return !!(foto?.valid && foto?.value);
    }
    if (this.mobileStep === 2) {
      const nome = this.certificateForm.get("nome");
      const empresa = this.certificateForm.get("empresa");
      const data = this.certificateForm.get("dataConclusao");
      return !!(nome?.valid && empresa?.valid && data?.valid);
    }
    if (this.mobileStep === 3) {
      return this.tags.length > 0;
    }
    return true;
  }

  nextStep(): void {
    if (this.mobileStep === 1) {
      this.certificateForm.get("foto")?.markAsTouched();
      if (!this.canGoNext) {
        if (!this.imageUploadError) {
          this.imageUploadError = "Por favor, anexe o comprovante do certificado antes de prosseguir.";
        }
        return;
      }
    }
    if (this.mobileStep === 2) {
      ["nome", "empresa", "dataConclusao"].forEach(f => this.certificateForm.get(f)?.markAsTouched());
      if (!this.canGoNext) return;
    }
    if (this.mobileStep === 3) {
      this.certificateForm.get("tagsInput")?.markAsTouched();
      if (!this.canGoNext) return;
    }
    if (this.mobileStep < this.totalSteps) {
      this.mobileStep++;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  prevStep(): void {
    if (this.mobileStep > 1) {
      this.mobileStep--;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  goToStep(step: number): void {
    if (step < this.mobileStep) {
      this.mobileStep = step;
    }
  }

  get isPdf(): boolean {
    const url = this.certificateForm.get("foto")?.value || "";
    return !!url && (url.toLowerCase().includes(".pdf") || url.startsWith("data:application/pdf"));
  }

  // ============================================================
  // Gerenciamento de Tags (Melhoria 1)
  // Input limpo ao adicionar e chips visuais na parte inferior
  // ============================================================
  onTagKeydown(event: KeyboardEvent, inputEl: HTMLInputElement): void {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      this.addTagsFromInput(inputEl);
      return;
    }

    if (event.key === "Backspace" && inputEl.value === "" && this.tags.length > 0) {
      this.removeTag(this.tags.length - 1);
    }
  }

  onTagBlur(inputEl: HTMLInputElement): void {
    this.addTagsFromInput(inputEl);
  }

  addTagsFromInput(inputEl: HTMLInputElement): void {
    const raw = inputEl.value;
    if (!raw || !raw.trim()) return;

    const parts = raw
      .split(",")
      .map(p => p.trim().toLowerCase())
      .filter(p => p.length > 0);

    for (const part of parts) {
      if (!this.tags.includes(part)) {
        this.tags.push(part);
      }
    }

    inputEl.value = "";
    this.syncTagsInputControl();
  }

  removeTag(index: number): void {
    if (index >= 0 && index < this.tags.length) {
      this.tags.splice(index, 1);
      this.syncTagsInputControl();
    }
  }

  private syncTagsInputControl(): void {
    this.certificateForm.patchValue({
      tagsInput: this.tags.join(", ")
    });
    this.certificateForm.get("tagsInput")?.markAsDirty();
    this.certificateForm.get("tagsInput")?.markAsTouched();
  }

  // ============================================================
  // Seleção e Extração de Arquivo (Melhoria 2)
  // Limpeza total de todos os inputs ao anexar novo certificado
  // ============================================================
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        this.imageUploadError = "O arquivo deve ter no máximo 5 MB.";
        return;
      }

      // Limpeza TOTAL de todos os campos anteriores ao selecionar novo certificado
      this.tags = [];
      this.certificateForm.patchValue({
        nome: "",
        empresa: "",
        dataConclusao: "",
        cargaHoraria: null,
        descricao: "",
        linkValidacao: "",
        tagsInput: "",
        foto: ""
      });
      this.certificateForm.markAsPristine();
      this.certificateForm.markAsUntouched();

      this.imagePreviewUrl = null;
      this.imageUploadError = null;
      this.aiSuccessFeedback = null;
      this.isExtractingAi = true;

      const isPdfFile = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

      if (isPdfFile) {
        this.pdfThumbnailService.generateThumbnail(file)
          .then((thumb) => {
            this.imagePreviewUrl = thumb;
          })
          .catch((err) => {
            console.warn("Falha ao gerar prévia da 1ª página do PDF:", err);
          });
      } else {
        this.imagePreviewUrl = URL.createObjectURL(file);
      }

      // Executa a extração por IA congelando a tela
      this.certificateService.extrairDadosIA(file).subscribe({
        next: (res) => {
          this.isExtractingAi = false;

          // Atualiza URL definitiva do Cloudflare R2
          if (res.fotoUrl) {
            this.certificateForm.patchValue({ foto: res.fotoUrl });
            if (!isPdfFile) {
              this.imagePreviewUrl = this.certificateService.resolveImageUrl(res.fotoUrl);
            }
          }

          // Preenche tags nos chips (sem poluir o input de texto)
          this.tags = (res.tags || [])
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 0);

          // Preenche os campos estritamente com os dados retornados (limpando o restante)
          this.certificateForm.patchValue({
            nome: res.nome || "",
            empresa: res.empresa || "",
            dataConclusao: res.dataConclusao || "",
            cargaHoraria: res.cargaHoraria || null,
            descricao: res.descricao || "",
            linkValidacao: res.linkValidacao || "",
            tagsInput: this.tags.join(", ")
          });

          if (res.nome || res.empresa) {
            this.aiSuccessFeedback = "Dados extraídos com Inteligência Artificial! Revise as informações abaixo antes de salvar.";
          } else {
            this.aiSuccessFeedback = "Comprovante anexado! A IA não identificou todos os dados automaticamente, preencha os campos abaixo.";
          }
        },
        error: (err) => {
          this.isExtractingAi = false;
          console.error("Erro na extração por IA, aplicando upload regular:", err);

          // Fallback gracioso: upload simples do arquivo caso a IA falhe
          this.isUploadingImage = true;
          this.certificateService.uploadImage(file).subscribe({
            next: (uploadRes) => {
              this.isUploadingImage = false;
              this.certificateForm.patchValue({ foto: uploadRes.url });
              if (!isPdfFile) {
                this.imagePreviewUrl = this.certificateService.resolveImageUrl(uploadRes.url);
              }
              this.imageUploadError = "Comprovante anexado. A leitura por IA está temporariamente indisponível, por favor preencha os dados manualmente.";
            },
            error: (uploadErr) => {
              this.isUploadingImage = false;
              console.error("Erro ao fazer upload do arquivo:", uploadErr);
              this.imageUploadError = uploadErr.error?.detail || uploadErr.error?.mensagem || "Falha ao enviar arquivo. Formatos suportados: PNG, JPEG, WebP ou PDF (máx 5MB).";
            }
          });
        }
      });
    }
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
        .then((thumb) => {
          this.imagePreviewUrl = thumb;
        })
        .catch(() => {
          this.imagePreviewUrl = null;
        });
    } else {
      this.imagePreviewUrl = resolved;
    }
  }

  onSubmit(): void {
    if (this.certificateForm.invalid || this.tags.length === 0) {
      this.certificateForm.markAllAsTouched();
      if (this.tags.length === 0) {
        this.errorMessage = "Informe pelo menos uma tag para categorizar o certificado.";
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const raw = this.certificateForm.value;

    const payload: CertificateRequestDTO = {
      nome: raw.nome.trim(),
      empresa: raw.empresa.trim(),
      dataConclusao: raw.dataConclusao,
      foto: raw.foto.trim(),
      tags: this.tags,
      cargaHoraria: raw.cargaHoraria ? Number(raw.cargaHoraria) : null,
      descricao: raw.descricao ? raw.descricao.trim() : null,
      linkValidacao: raw.linkValidacao ? raw.linkValidacao.trim() : null,
      publico: raw.publico
    };

    this.certificateService.createCertificate(payload).subscribe({
      next: () => {
        this.router.navigate(["/certificados"]);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = "Já existe um certificado com estes dados.";
        } else if (err.error?.mensagem) {
          this.errorMessage = err.error.mensagem;
        } else {
          this.errorMessage = "Erro ao salvar certificado. Verifique os campos.";
        }
      }
    });
  }
}
