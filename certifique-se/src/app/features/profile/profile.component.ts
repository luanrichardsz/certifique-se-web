import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { UserService } from "../../core/services/user.service";
import { User, UserUpdateDTO, ChangePasswordDTO } from "../../core/models/user.model";
import { CommonModule } from "@angular/common";
import { ImageCropperModalComponent } from "../../shared/components/image-cropper-modal/image-cropper-modal.component";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ImageCropperModalComponent],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css"
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  userService = inject(UserService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  activeTab: "perfil" | "seguranca" = "perfil";

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

  isUploadingPhoto = false;
  photoSuccess: string | null = null;
  photoError: string | null = null;
  avatarImageError = false;

  // Image Cropper Modal state
  showCropperModal = false;
  cropImageSource: string | null = null;

  isChangingPassword = false;
  showSenhaAtual = false;
  showNovaSenha = false;
  showConfirmarSenha = false;
  passwordSuccess: string | null = null;
  passwordError: string | null = null;

  isDeletingAccount = false;
  showDeleteSenhaAtual = false;
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

  onAvatarError(): void {
    this.avatarImageError = true;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      this.photoError = "Formato de imagem inválido. Use JPEG, PNG ou WebP.";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      this.photoError = "A foto de perfil deve ter no máximo 3MB.";
      return;
    }

    this.photoError = null;
    this.photoSuccess = null;

    // Load file into DataURL and open interactive 1:1 cropper
    const reader = new FileReader();
    reader.onload = () => {
      this.cropImageSource = reader.result as string;
      this.showCropperModal = true;
    };
    reader.readAsDataURL(file);

    input.value = "";
  }

  onCropConfirmed(croppedFile: File): void {
    this.showCropperModal = false;
    this.cropImageSource = null;

    this.isUploadingPhoto = true;
    this.photoError = null;
    this.photoSuccess = null;
    this.avatarImageError = false;

    this.userService.uploadAvatar(croppedFile).subscribe({
      next: (updatedUser) => {
        this.isUploadingPhoto = false;
        this.authService.setCurrentUser(updatedUser);
        this.photoSuccess = "Foto de perfil atualizada com sucesso!";
        setTimeout(() => (this.photoSuccess = null), 4000);
      },
      error: (err) => {
        this.isUploadingPhoto = false;
        this.photoError = err.error?.mensagem || "Erro ao enviar foto. Tente novamente.";
      }
    });
  }

  onCropCancelled(): void {
    this.showCropperModal = false;
    this.cropImageSource = null;
  }

  onRemovePhoto(): void {
    if (!confirm("Deseja realmente remover sua foto de perfil?")) return;

    this.isUploadingPhoto = true;
    this.photoError = null;
    this.photoSuccess = null;

    this.userService.deleteAvatar().subscribe({
      next: (updatedUser) => {
        this.isUploadingPhoto = false;
        this.authService.setCurrentUser(updatedUser);
        this.photoSuccess = "Foto de perfil removida com sucesso!";
        setTimeout(() => (this.photoSuccess = null), 4000);
      },
      error: (err) => {
        this.isUploadingPhoto = false;
        this.photoError = err.error?.mensagem || "Erro ao remover foto.";
      }
    });
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
