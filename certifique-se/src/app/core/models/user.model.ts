export interface User {
  idUsuario: number;
  nomeUsuario: string;
  username: string;
  email: string;
  headline?: string;
  biografia?: string;
  perfilPublico: boolean;
  role: "USER" | "ADMIN";
  criadoEm: string;
}

export interface UserUpdateDTO {
  nomeUsuario: string;
  email: string;
  username?: string;
  headline?: string;
  biografia?: string;
  perfilPublico?: boolean;
}

export interface ChangePasswordDTO {
  senhaAtual: string;
  novaSenha: string;
}
