import { User } from "./user.model";

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
}

export interface RegisterRequest {
  nomeUsuario: string;
  email: string;
  senha: string;
  username?: string;
  headline?: string;
  biografia?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  novaSenha: string;
}
