import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = res?.mensagem || "E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.";
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.errorMessage = err.error?.detail || err.error?.mensagem || "Este e-mail não foi encontrado em nosso sistema.";
        } else if (err.status === 0) {
          this.errorMessage = "Falha de conexão com o servidor. Verifique sua conexão e tente novamente.";
        } else {
          this.errorMessage = err.error?.detail || err.error?.mensagem || "Erro ao solicitar recuperação de senha. Tente novamente.";
        }
      }
    });
  }
}
