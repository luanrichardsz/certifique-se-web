export interface PublicProfile {
  nomeUsuario: string;
  username: string;
  headline?: string;
  biografia?: string;
  membroDesde: string;
  totalCertificados: number;
  totalHoras: number;
}

export interface PublicCertificate {
  hashCertificado: string;
  foto: string;
  nome: string;
  empresa: string;
  dataConclusao: string;
  tags: string[];
  cargaHoraria?: number | null;
  descricao?: string | null;
  linkValidacao?: string | null;
}
