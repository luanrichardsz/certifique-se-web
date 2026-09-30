export interface Certificate {
  idCertificado: number;
  hashCertificado: string;
  foto: string;
  nome: string;
  empresa: string;
  dataConclusao: string;
  tags: string[];
  cargaHoraria?: number | null;
  descricao?: string | null;
  linkValidacao?: string | null;
  publico: boolean;
}

export interface CertificateRequestDTO {
  foto: string;
  nome: string;
  empresa: string;
  dataConclusao: string;
  tags: string[];
  cargaHoraria?: number | null;
  descricao?: string | null;
  linkValidacao?: string | null;
  publico?: boolean;
}

export interface CertificateUpdateDTO {
  foto: string;
  nome: string;
  empresa: string;
  dataConclusao: string;
  tags: string[];
  cargaHoraria?: number | null;
  descricao?: string | null;
  linkValidacao?: string | null;
  publico?: boolean;
}

export interface CertificateFilterDTO {
  nome?: string;
  empresa?: string;
  dataConclusao?: string;
  tags?: string;
}

export interface CertificadoExtracaoResponse {
  nome?: string | null;
  empresa?: string | null;
  dataConclusao?: string | null;
  cargaHoraria?: number | null;
  tags: string[];
  descricao?: string | null;
  linkValidacao?: string | null;
  fotoChave?: string;
  fotoUrl?: string;
}
