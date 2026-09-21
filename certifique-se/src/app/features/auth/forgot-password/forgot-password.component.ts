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
      next: () => {
        this.isLoading = false;
        this.successMessage = "Se o e-mail estiver cadastrado, enviamos as instruções para recuperação da sua senha.";
      },
      error: () => {
        this.isLoading = false;
        // Even on error, standard security practice is generic message or friendly prompt
        this.successMessage = "Se o e-mail estiver cadastrado, enviamos as instruções para recuperação da sua senha.";
      }
    });
  }
}
