import { HttpErrorResponse } from "@angular/common/http";

export function extractApiErrorMessage(
  err: unknown,
  fallbackMessage = "Ocorreu um erro inesperado. Tente novamente."
): string {
  if (!err) return fallbackMessage;

  const httpErr = err as HttpErrorResponse;

  if (httpErr.status === 0) {
    return "Falha de conexão com o servidor. Verifique sua internet ou tente novamente em instantes.";
  }

  const body = httpErr.error;
  if (typeof body === "string" && body.trim().length > 0) {
    return body;
  }

  if (body && typeof body === "object") {
    if (typeof body.detail === "string" && body.detail.trim()) {
      return body.detail;
    }
    if (typeof body.mensagem === "string" && body.mensagem.trim()) {
      return body.mensagem;
    }
    if (typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }
    if (typeof body.erro === "string" && body.erro.trim()) {
      return body.erro;
    }
    if (Array.isArray(body.errors) && body.errors.length > 0) {
      const first = body.errors[0];
      if (typeof first === "string") return first;
      if (first?.defaultMessage) return first.defaultMessage;
      if (first?.message) return first.message;
    }
  }

  if (httpErr.status === 429) {
    return "Muitas tentativas realizadas. Aguarde alguns instantes antes de tentar novamente.";
  }

  if (httpErr.status >= 500) {
    return "Erro interno no servidor. Por favor, tente novamente mais tarde.";
  }

  return fallbackMessage;
}

