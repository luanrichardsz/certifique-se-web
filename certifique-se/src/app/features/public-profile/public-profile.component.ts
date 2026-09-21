import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PublicService } from "../../core/services/public.service";
import { PublicProfile, PublicCertificate } from "../../core/models/public-profile.model";
import { CertificateCardComponent } from "../../shared/components/certificate-card/certificate-card.component";
import { Certificate } from "../../core/models/certificate.model";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
  selector: "app-public-profile",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CertificateCardComponent, EmptyStateComponent],
  templateUrl: "./public-profile.component.html",
  styleUrl: "./public-profile.component.css"
})
export class PublicProfileComponent implements OnInit {
  private publicService = inject(PublicService);
  private route = inject(ActivatedRoute);

  username = "";
  profile: PublicProfile | null = null;
  certificates: Certificate[] = [];
  isLoading = true;
  notFound = false;
  searchQuery = "";
  selectedTag = "";

  get userInitials(): string {
    if (!this.profile?.nomeUsuario) return "U";
    return this.profile.nomeUsuario
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  get allTags(): string[] {
    const tags = this.certificates.flatMap((c) => c.tags || []);
    return Array.from(new Set(tags)).sort();
  }

  get filteredCertificates(): Certificate[] {
    return this.certificates.filter((cert) => {
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = cert.nome.toLowerCase().includes(q);
        const matchesEmpresa = cert.empresa.toLowerCase().includes(q);
        const matchesTag = cert.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesEmpresa && !matchesTag) return false;
      }
      if (this.selectedTag && !cert.tags.includes(this.selectedTag)) {
        return false;
      }
      return true;
    });
  }

  ngOnInit(): void {
    this.username = this.route.snapshot.params["username"];
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.notFound = false;

    this.publicService.getPublicProfile(this.username).subscribe({
      next: (prof) => {
        this.profile = prof;
        this.loadCertificates();
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
      }
    });
  }

  loadCertificates(): void {
    this.publicService.getPublicCertificates(this.username).subscribe({
      next: (list) => {
        // Map PublicCertificate to Certificate interface
        this.certificates = list.map((c, index) => ({
          idCertificado: index,
          hashCertificado: c.hashCertificado,
          foto: c.foto,
          nome: c.nome,
          empresa: c.empresa,
          dataConclusao: c.dataConclusao,
          tags: c.tags,
          cargaHoraria: c.cargaHoraria,
          descricao: c.descricao,
          linkValidacao: c.linkValidacao,
          publico: true
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
