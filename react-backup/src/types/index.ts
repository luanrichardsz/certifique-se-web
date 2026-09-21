export interface Tag {
  id?: number | string;
  name: string;
}

export interface Certificate {
  id: string;
  name: string;
  institution: string;
  completionDate: string; // ISO date string (YYYY-MM-DD)
  issueDate?: string;
  workloadHours?: number;
  credentialCode?: string;
  credentialUrl?: string;
  description?: string;
  tags: Tag[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: 'image' | 'pdf';
  thumbnailUrl?: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  isPublicProfileEnabled?: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

export interface CertificateFilterParams {
  query?: string;
  institution?: string;
  tag?: string;
  year?: string;
}

export interface StatSummary {
  totalCertificates: number;
  totalInstitutions: number;
  totalTags: number;
  recentCertificates: Certificate[];
}
