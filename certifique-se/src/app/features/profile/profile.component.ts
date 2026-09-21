import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { UserService } from "../../core/services/user.service";
import { User, UserUpdateDTO, ChangePasswordDTO } from "../../core/models/user.model";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css"
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;

  profileForm: FormGroup = this.fb.group({
    nomeUsuario: ["", [Validators.required, Validators.maxLength(100)]],
    email: ["", [Validators.required, Validators.email, Validators.maxLength(150)]],
    username: ["", [Validators.pattern(/^[a-zA-Z0-9._-]+$/), Validators.minLength(3), Validators.maxLength(50)]],
    headline: ["", [Validators.maxLength(150)]],
    biografia: ["", [Validators.maxLength(500)]],
    perfilPublico: [true]
  });

  passwordForm: FormGroup = this.fb.group({
    senhaAtual: ["", [Validators.required]],
    novaSenha: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    confirmarSenha: ["", [Validators.required]]
  });

  deleteForm: FormGroup = this.fb.group({
    senhaAtual: ["", [Validators.required]]
  });

  isSavingProfile = false;
  profileSuccess: string | null = null;
  profileError: string | null = null;

  isChangingPassword = false;
  passwordSuccess: string | null = null;
  passwordError: string | null = null;

  isDeletingAccount = false;
  deleteError: string | null = null;
  showDeleteConfirm = false;

  copied = false;

  get publicProfileUrl(): string {
    const username = this.currentUser()?.username;
    if (!username) return "";
    return `${window.location.origin}/u/${username}`;
  }

  get userInitials(): string {
    const user = this.currentUser();
    if (!user || !user.nomeUsuario) return "U";
    return user.nomeUsuario
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  ngOnInit(): void {
    this.populateForm();
  }

  populateForm(): void {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        nomeUsuario: user.nomeUsuario,
        email: user.email,
        username: user.username || "",
        headline: user.headline || "",
        biografia: user.biografia || "",
        perfilPublico: user.perfilPublico ?? true
      });
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.publicProfileUrl);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSavingProfile = true;
    this.profileSuccess = null;
    this.profileError = null;

    const val = this.profileForm.value;
    const dto: UserUpdateDTO = {
      nomeUsuario: val.nomeUsuario.trim(),
      email: val.email.trim(),
      username: val.username ? val.username.trim() : undefined,
      headline: val.headline ? val.headline.trim() : undefined,
      biografia: val.biografia ? val.biografia.trim() : undefined,
      perfilPublico: val.perfilPublico
    };

    this.userService.updateProfile(dto).subscribe({
      next: (updatedUser) => {
        this.isSavingProfile = false;
        this.authService.setCurrentUser(updatedUser);
        this.profileSuccess = "Perfil atualizado com sucesso!";
        setTimeout(() => (this.profileSuccess = null), 3000);
      },
      error: (err) => {
        this.isSavingProfile = false;
        this.profileError = err.error?.mensagem || "Erro ao atualizar perfil. Verifique os dados.";
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { senhaAtual, novaSenha, confirmarSenha } = this.passwordForm.value;
    if (novaSenha !== confirmarSenha) {
      this.passwordError = "A nova senha e a confirmação não coincidem.";
      return;
    }

    this.isChangingPassword = true;
    this.passwordSuccess = null;
    this.passwordError = null;

    this.userService.changePassword({ senhaAtual, novaSenha }).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordSuccess = "Senha alterada com sucesso!";
        this.passwordForm.reset();
        setTimeout(() => (this.passwordSuccess = null), 3000);
      },
      error: (err) => {
        this.isChangingPassword = false;
        this.passwordError = err.error?.mensagem || "Senha atual incorreta.";
      }
    });
  }

  onDeleteAccount(): void {
    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      return;
    }

    this.isDeletingAccount = true;
    this.deleteError = null;

    this.userService.deleteAccount(this.deleteForm.value.senhaAtual).subscribe({
      next: () => {
        this.authService.logout();
      },
      error: (err) => {
        this.isDeletingAccount = false;
        this.deleteError = err.error?.mensagem || "Senha incorreta. Não foi possível excluir a conta.";
      }
    });
  }
}
