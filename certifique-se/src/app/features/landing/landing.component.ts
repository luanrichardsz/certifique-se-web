import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

interface SampleCert {
  id: string;
  title: string;
  issuer: string;
  hours: number;
  date: string;
  category: string;
  image: string;
  code: string;
}

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: "./landing.component.html",
  styleUrl: "./landing.component.css"
})
export class LandingComponent {
  authService = inject(AuthService);

  // Live demo interactive state
  demoName = "Ana Souza";
  selectedCertId = "python";

  sampleCerts: SampleCert[] = [
    {
      id: "python",
      title: "Introdução à Análise de Dados com Python",
      issuer: "Escola Aberta de Dados",
      hours: 40,
      date: "12 de março de 2026",
      category: "Programação e Dados",
      image: "landing/cert-python.jpg",
      code: "EAD-9821-PYTH"
    },
    {
      id: "semana",
      title: "Semana Acadêmica de Computação",
      issuer: "Universidade Federal",
      hours: 20,
      date: "28 de outubro de 2025",
      category: "Extensão Universitária",
      image: "landing/cert-semana.jpg",
      code: "7F3A-21C9"
    },
    {
      id: "scrum",
      title: "Scrum e Métodos Ágeis na Prática",
      issuer: "Instituto de Desenvolvimento",
      hours: 16,
      date: "05 de janeiro de 2026",
      category: "Gestão Ágil",
      image: "landing/cert-scrum.jpg",
      code: "SCRUM-2026-BR"
    }
  ];

  get sanitizedUsername(): string {
    const raw = this.demoName.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return raw || "seu-usuario";
  }

  get totalDemoHours(): number {
    return this.sampleCerts.reduce((acc, c) => acc + c.hours, 0);
  }

  get activeCert(): SampleCert {
    return this.sampleCerts.find(c => c.id === this.selectedCertId) || this.sampleCerts[0];
  }

  selectCert(id: string): void {
    this.selectedCertId = id;
  }
}
