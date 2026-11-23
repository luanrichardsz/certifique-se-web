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
  selector: "app-register",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css"
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  registerForm: FormGroup = this.fb.group({
    nomeUsuario: ["", [Validators.required, Validators.maxLength(100)]],
    email: ["", [Validators.required, Validators.email, Validators.maxLength(150)]],
    username: ["", [Validators.pattern(/^[a-zA-Z0-9._-]+$/), Validators.minLength(3), Validators.maxLength(50)]],
    headline: ["", [Validators.maxLength(150)]],
    senha: ["", [Validators.required, strongPasswordValidator(), Validators.maxLength(100)]]
  });

  isLoading = false;
  showPassword = false;
  errorMessage: string | null = null;

  get passwordChecks(): PasswordRequirementChecks {
    return evaluatePasswordRequirements(this.registerForm.get("senha")?.value);
  }

  ngOnInit(): void {
    const emailParam = this.route.snapshot.queryParams["email"];
    if (emailParam) {
      this.registerForm.patchValue({ email: emailParam });
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formVal = this.registerForm.value;
    const data: any = {
      nomeUsuario: formVal.nomeUsuario?.trim(),
      email: formVal.email?.trim()?.toLowerCase(),
      senha: formVal.senha
    };

    const username = formVal.username?.trim();
    if (username) {
      data.username = username.toLowerCase();
    }

    const headline = formVal.headline?.trim();
    if (headline) {
      data.headline = headline;
    }

    this.authService.register(data).subscribe({
      next: () => {
        // Automatically login after registration
        this.authService.login({ email: data.email, senha: data.senha }).subscribe({
          next: () => {
            this.authService.loadCurrentUser().subscribe({
              next: () => this.router.navigate(["/dashboard"]),
              error: () => this.router.navigate(["/login"])
            });
          },
          error: (loginErr) => {
            console.error("Erro ao fazer login automático após registro:", loginErr);
            this.router.navigate(["/login"]);
          }
        });
      },
      error: (err) => {
        console.error("Erro detalhado no cadastro de usuário:", err);
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = extractApiErrorMessage(
            err,
            "Já existe uma conta cadastrada com este e-mail ou username."
          );
        } else {
          this.errorMessage = extractApiErrorMessage(
            err,
            "Erro ao cadastrar usuário. Verifique os dados e tente novamente."
          );
        }
      }
    });
  }
}
