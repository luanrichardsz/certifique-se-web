import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import {
  evaluatePasswordRequirements,
  PasswordRequirementChecks,
  strongPasswordValidator
} from "../../../shared/validators/password.validator";
import { extractApiErrorMessage } from "../../../core/utils/api-error.util";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./reset-password.component.html"
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = "";
  form: FormGroup = this.fb.group({
    novaSenha: ["", [Validators.required, strongPasswordValidator(), Validators.maxLength(100)]],
    confirmarSenha: ["", [Validators.required]]
  });

  isLoading = false;
  showNovaSenha = false;
  showConfirmarSenha = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  get passwordChecks(): PasswordRequirementChecks {
    return evaluatePasswordRequirements(this.form.get("novaSenha")?.value);
  }

  get passwordsMismatch(): boolean {
    const nova = this.form.get("novaSenha")?.value;
    const conf = this.form.get("confirmarSenha")?.value;
    return !!(nova && conf && nova !== conf);
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams["token"] || "";
    if (!this.token) {
      this.errorMessage = "Token de recuperação ausente ou link incompleto. Solicite um novo link de recuperação.";
    }
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
      this.errorMessage = "Token de recuperação ausente ou inválido. Solicite um novo link.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.resetPassword({
      token: this.token,
      novaSenha: this.form.value.novaSenha,
      confirmacaoNovaSenha: this.form.value.confirmarSenha
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = "Sua senha foi redefinida com sucesso! Redirecionando para o login...";
        setTimeout(() => this.router.navigate(["/login"]), 2500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = extractApiErrorMessage(
          err,
          "O link de recuperação expirou ou é inválido. Solicite uma nova recuperação de senha."
        );
      }
    });
  }
}
