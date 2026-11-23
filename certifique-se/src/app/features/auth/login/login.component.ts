import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { extractApiErrorMessage } from "../../../core/utils/api-error.util";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css"
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    senha: ["", [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  showPassword = false;
  errorMessage: string | null = null;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.authService.loadCurrentUser().subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
            this.router.navigateByUrl(returnUrl);
          },
          error: () => {
            this.router.navigate(["/dashboard"]);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.errorMessage = "Não encontramos uma conta com este e-mail. Verifique o endereço ou cadastre-se gratuitamente.";
        } else if (err.status === 401 || err.status === 400) {
          this.errorMessage = extractApiErrorMessage(err, "E-mail ou senha incorretos. Verifique suas credenciais.");
        } else {
          this.errorMessage = extractApiErrorMessage(err, "Erro ao conectar com o servidor. Tente novamente mais tarde.");
        }
      }
    });
  }
}
