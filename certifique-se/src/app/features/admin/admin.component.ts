import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { forkJoin } from "rxjs";

import { UserService } from "../../core/services/user.service";
import { CertificateService } from "../../core/services/certificate.service";
import { AuthService } from "../../core/services/auth.service";
import { User } from "../../core/models/user.model";
import { Certificate } from "../../core/models/certificate.model";
import { StatsCardComponent } from "../../shared/components/stats-card/stats-card.component";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    StatsCardComponent,
    DatePipe
  ],
  templateUrl: "./admin.component.html",
  styleUrl: "./admin.component.css"
})
export class AdminComponent implements OnInit {
  userService = inject(UserService);
  certificateService = inject(CertificateService);
  authService = inject(AuthService);

  users = signal<User[]>([]);
  certificates = signal<Certificate[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  searchTerm = signal<string>("");
  roleFilter = signal<"ALL" | "ADMIN" | "USER">("ALL");

  private avatarErrors = signal<Record<number, boolean>>({});

  // KPIs
  totalUsers = computed(() => this.users().length);
  totalCertificates = computed(() => this.certificates().length);

  totalAdmins = computed(() => this.users().filter((u) => u.role === "ADMIN").length);
  totalRegularUsers = computed(() => this.users().filter((u) => u.role === "USER").length);

  publicProfilesCount = computed(() => this.users().filter((u) => u.perfilPublico).length);
  privateProfilesCount = computed(() => this.users().length - this.publicProfilesCount());

  publicProfilesRate = computed(() => {
    const total = this.totalUsers();
    if (total === 0) return 0;
    return Math.round((this.publicProfilesCount() / total) * 100);
  });

  totalHours = computed(() => {
    return this.certificates().reduce((acc, curr) => acc + (curr.cargaHoraria || 0), 0);
  });

  totalHoursFormatted = computed(() => {
    const hours = this.totalHours();
    return `${hours.toLocaleString("pt-BR")}h`;
  });

  // Top Institutions / Issuers
  topIssuers = computed(() => {
    const counts: Record<string, number> = {};
    for (const cert of this.certificates()) {
      const name = cert.empresa?.trim() || "Não informada";
      counts[name] = (counts[name] || 0) + 1;
    }

    const total = this.certificates().length;
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  // Top Tags / Technologies
  topTags = computed(() => {
    const counts: Record<string, number> = {};
    for (const cert of this.certificates()) {
      if (cert.tags && Array.isArray(cert.tags)) {
        for (const rawTag of cert.tags) {
          const tag = rawTag?.trim();
          if (tag) {
            counts[tag] = (counts[tag] || 0) + 1;
          }
        }
      }
    }

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  });

  // Filtered Users List
  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const role = this.roleFilter();

    return this.users().filter((user) => {
      const matchRole = role === "ALL" || user.role === role;
      if (!matchRole) return false;

      if (!term) return true;

      const nameMatch = user.nomeUsuario?.toLowerCase().includes(term);
      const emailMatch = user.email?.toLowerCase().includes(term);
      const userMatch = user.username?.toLowerCase().includes(term);
      const headlineMatch = user.headline?.toLowerCase().includes(term);

      return nameMatch || emailMatch || userMatch || headlineMatch;
    });
  });

  ngOnInit(): void {
    this.loadAdminData();
  }

  loadAdminData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      users: this.userService.getAllUsers(),
      certificates: this.certificateService.getAllCertificates()
    }).subscribe({
      next: ({ users, certificates }) => {
        this.users.set(users || []);
        this.certificates.set(certificates || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Falha ao carregar dados administrativos:", err);
        this.errorMessage.set(
          "Não foi possível carregar os dados administrativos. Verifique se sua conta tem permissões de administrador ativas."
        );
        this.isLoading.set(false);
      }
    });
  }

  onAvatarError(userId: number): void {
    this.avatarErrors.update((prev) => ({ ...prev, [userId]: true }));
  }

  hasAvatarError(userId: number): boolean {
    return !!this.avatarErrors()[userId];
  }

  getUserInitials(name: string): string {
    if (!name) return "U";
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  setRoleFilter(filter: "ALL" | "ADMIN" | "USER"): void {
    this.roleFilter.set(filter);
  }

  clearSearch(): void {
    this.searchTerm.set("");
    this.roleFilter.set("ALL");
  }
}
