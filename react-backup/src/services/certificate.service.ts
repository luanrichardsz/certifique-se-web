import { Certificate, CertificateFilterParams, StatSummary, Tag } from '../types';

const CERTIFICATES_STORAGE_KEY = 'certifiquese_certificates_data';

export const INITIAL_MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-01',
    name: 'Java Foundations',
    institution: 'Oracle',
    completionDate: '2026-05-12',
    issueDate: '2026-05-12',
    workloadHours: 60,
    credentialCode: 'ORCL-JF-89421',
    credentialUrl: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=demo',
    description: 'Certificação abordando fundamentos de linguagem Java, Programação Orientada a Objetos, tipos de dados, estruturas de controle e coleções.',
    tags: [
      { id: '1', name: 'Java' },
      { id: '2', name: 'Backend' },
      { id: '3', name: 'Oracle' },
    ],
    fileType: 'image',
    fileName: 'certificado-oracle-java-foundations.png',
    fileSize: '1.4 MB',
    fileUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    isPublic: true,
    createdAt: '2026-05-12T14:30:00.000Z',
  },
  {
    id: 'cert-02',
    name: 'Angular Fundamentals',
    institution: 'Udemy',
    completionDate: '2026-07-20',
    issueDate: '2026-07-20',
    workloadHours: 42,
    credentialCode: 'UC-78a9c112',
    credentialUrl: 'https://www.udemy.com/certificate/UC-78a9c112/',
    description: 'Curso completo de desenvolvimento front-end com Angular, TypeScript, RxJS, Reactive Forms, Standalone Components e Angular Router.',
    tags: [
      { id: '4', name: 'Angular' },
      { id: '5', name: 'Frontend' },
      { id: '6', name: 'TypeScript' },
    ],
    fileType: 'image',
    fileName: 'certificado-angular-fundamentals.png',
    fileSize: '2.1 MB',
    fileUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    isPublic: true,
    createdAt: '2026-07-20T18:10:00.000Z',
  },
  {
    id: 'cert-03',
    name: 'Spring Boot Developer',
    institution: 'Alura',
    completionDate: '2026-03-15',
    issueDate: '2026-03-15',
    workloadHours: 50,
    credentialCode: 'ALU-SPB-2026',
    credentialUrl: 'https://cursos.alura.com.br/certificate/demo',
    description: 'Desenvolvimento de APIs RESTful com Spring Boot, Spring Data JPA, Hibernate, Spring Security com JWT, validações e documentação com OpenAPI.',
    tags: [
      { id: '1', name: 'Java' },
      { id: '7', name: 'Spring Boot' },
      { id: '2', name: 'Backend' },
      { id: '8', name: 'API REST' },
    ],
    fileType: 'image',
    fileName: 'certificado-alura-spring-boot.png',
    fileSize: '1.8 MB',
    fileUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    isPublic: true,
    createdAt: '2026-03-15T09:45:00.000Z',
  },
  {
    id: 'cert-04',
    name: 'AWS Certified Cloud Practitioner',
    institution: 'Amazon Web Services',
    completionDate: '2025-11-05',
    issueDate: '2025-11-05',
    workloadHours: 35,
    credentialCode: 'AWS-CCP-992014',
    credentialUrl: 'https://aws.amazon.com/verification',
    description: 'Conceitos fundamentais de computação em nuvem na AWS, infraestrutura global, serviços essenciais (EC2, S3, RDS, Lambda) e modelo de segurança compartilhada.',
    tags: [
      { id: '9', name: 'AWS' },
      { id: '10', name: 'Cloud' },
      { id: '11', name: 'DevOps' },
    ],
    fileType: 'image',
    fileName: 'aws-certified-cloud-practitioner.pdf',
    fileSize: '890 KB',
    fileUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    isPublic: true,
    createdAt: '2025-11-05T16:20:00.000Z',
  },
  {
    id: 'cert-05',
    name: 'UI/UX Design & Design Systems',
    institution: 'FIAP',
    completionDate: '2025-08-30',
    issueDate: '2025-08-30',
    workloadHours: 40,
    credentialCode: 'FIAP-UIX-551',
    description: 'Criação de interfaces responsivas, arquitetura de informação, testes de usabilidade, heurísticas de Nielsen e construção de componentes com Design Systems.',
    tags: [
      { id: '12', name: 'UI/UX' },
      { id: '13', name: 'Design' },
      { id: '5', name: 'Frontend' },
    ],
    fileType: 'image',
    fileName: 'fiap-ui-ux-design.png',
    fileSize: '2.5 MB',
    fileUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    isPublic: true,
    createdAt: '2025-08-30T11:00:00.000Z',
  },
];

type CertificateListener = (certificates: Certificate[]) => void;

class CertificateService {
  private certificates: Certificate[] = [];
  private listeners: CertificateListener[] = [];

  constructor() {
    const saved = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
    if (saved) {
      try {
        this.certificates = JSON.parse(saved);
      } catch {
        this.certificates = [...INITIAL_MOCK_CERTIFICATES];
        this.saveToStorage();
      }
    } else {
      this.certificates = [...INITIAL_MOCK_CERTIFICATES];
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(this.certificates));
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.certificates]));
  }

  subscribe(listener: CertificateListener): () => void {
    this.listeners.push(listener);
    listener([...this.certificates]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async getAll(params?: CertificateFilterParams): Promise<Certificate[]> {
    await new Promise((res) => setTimeout(res, 200));
    let result = [...this.certificates];

    if (params) {
      const { query, institution, tag, year } = params;

      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.institution.toLowerCase().includes(q) ||
            c.tags.some((t) => t.name.toLowerCase().includes(q))
        );
      }

      if (institution && institution.trim()) {
        result = result.filter((c) => c.institution.toLowerCase() === institution.toLowerCase());
      }

      if (tag && tag.trim()) {
        result = result.filter((c) => c.tags.some((t) => t.name.toLowerCase() === tag.toLowerCase()));
      }

      if (year && year.trim()) {
        result = result.filter((c) => c.completionDate.startsWith(year));
      }
    }

    // Sort newest completionDate first
    return result.sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime());
  }

  async getById(id: string): Promise<Certificate | null> {
    await new Promise((res) => setTimeout(res, 150));
    const cert = this.certificates.find((c) => c.id === id);
    return cert ? { ...cert } : null;
  }

  async create(data: Omit<Certificate, 'id' | 'createdAt'>): Promise<Certificate> {
    await new Promise((res) => setTimeout(res, 450));
    const newCert: Certificate = {
      ...data,
      id: 'cert-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      tags: data.tags.map((t, idx) => ({
        id: t.id || `tag-${Date.now()}-${idx}`,
        name: t.name.trim(),
      })),
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
    };

    this.certificates = [newCert, ...this.certificates];
    this.saveToStorage();
    return newCert;
  }

  async update(id: string, data: Partial<Certificate>): Promise<Certificate> {
    await new Promise((res) => setTimeout(res, 400));
    const index = this.certificates.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Certificado não encontrado.');
    }

    const updated: Certificate = {
      ...this.certificates[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.certificates[index] = updated;
    this.saveToStorage();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    const initialLength = this.certificates.length;
    this.certificates = this.certificates.filter((c) => c.id !== id);
    if (this.certificates.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  async getStats(): Promise<StatSummary> {
    await new Promise((res) => setTimeout(res, 150));
    const totalCertificates = this.certificates.length;

    const institutionsSet = new Set(this.certificates.map((c) => c.institution.trim().toLowerCase()));
    const totalInstitutions = institutionsSet.size;

    const tagsSet = new Set<string>();
    this.certificates.forEach((c) => {
      c.tags.forEach((t) => tagsSet.add(t.name.trim().toLowerCase()));
    });
    const totalTags = tagsSet.size;

    const recentCertificates = [...this.certificates]
      .sort((a, b) => new Date(b.createdAt || b.completionDate).getTime() - new Date(a.createdAt || a.completionDate).getTime())
      .slice(0, 4);

    return {
      totalCertificates,
      totalInstitutions,
      totalTags,
      recentCertificates,
    };
  }

  getDistinctInstitutions(): string[] {
    const list = Array.from(new Set(this.certificates.map((c) => c.institution.trim()))).filter(Boolean);
    return list.sort((a, b) => a.localeCompare(b));
  }

  getDistinctTags(): string[] {
    const tagMap = new Map<string, string>();
    this.certificates.forEach((c) => {
      c.tags.forEach((t) => {
        const lower = t.name.trim().toLowerCase();
        if (!tagMap.has(lower)) {
          tagMap.set(lower, t.name.trim());
        }
      });
    });
    return Array.from(tagMap.values()).sort((a, b) => a.localeCompare(b));
  }

  getDistinctYears(): string[] {
    const years = new Set<string>();
    this.certificates.forEach((c) => {
      if (c.completionDate && c.completionDate.length >= 4) {
        years.add(c.completionDate.substring(0, 4));
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }

  async getPublicCertificatesByUsername(username: string): Promise<Certificate[]> {
    await new Promise((res) => setTimeout(res, 250));
    return this.certificates.filter((c) => c.isPublic !== false);
  }

  resetToDefaultData() {
    this.certificates = [...INITIAL_MOCK_CERTIFICATES];
    this.saveToStorage();
  }
}

export const certificateService = new CertificateService();
