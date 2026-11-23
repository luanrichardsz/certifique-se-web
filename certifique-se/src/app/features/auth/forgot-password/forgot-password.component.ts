import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { extractApiErrorMessage } from "../../../core/utils/api-error.util";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./forgot-password.component.html"
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]]
  });

  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  accountNotFound = false;

  get typedEmail(): string {
    return (this.form.get("email")?.value || "").trim().toLowerCase();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.accountNotFound = false;

    const email = this.typedEmail;

    this.authService.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = res?.mensagem || "E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.";
      },
      error: (err: any) => {
        this.isLoading = false;
        const apiMsg = extractApiErrorMessage(err, "");
        const isNotFoundByMsg = /n[aã]o encontrad|n[aã]o cadastrad|inexistente|no user|not found/i.test(apiMsg);

        if (err.status === 404 || isNotFoundByMsg) {
          this.accountNotFound = true;
          this.errorMessage =
            "Não encontramos nenhuma conta cadastrada com este e-mail. Para acessar a plataforma, você precisa criar uma conta primeiro.";
        } else {
          this.errorMessage = extractApiErrorMessage(
            err,
            "Erro ao solicitar recuperação de senha. Verifique o e-mail informado e tente novamente."
          );
        }
      }
    });
  }
}
