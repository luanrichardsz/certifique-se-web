import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./reset-password.component.html"
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = "";
  form: FormGroup = this.fb.group({
    novaSenha: ["", [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ["", [Validators.required]]
  });

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams["token"] || "";
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.novaSenha !== this.form.value.confirmarSenha) {
      this.errorMessage = "As senhas não coincidem.";
      return;
    }

    if (!this.token) {
      this.errorMessage = "Token de recuperação ausente ou inválido.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.resetPassword({ token: this.token, novaSenha: this.form.value.novaSenha }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = "Sua senha foi redefinida com sucesso! Você já pode fazer login.";
        setTimeout(() => this.router.navigate(["/login"]), 2500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.mensagem || "O link de recuperação expirou ou é inválido.";
      }
    });
  }
}
