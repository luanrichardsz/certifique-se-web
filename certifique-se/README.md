# 🎓 Certifique-se (Frontend Angular)

Aplicação Web em **Angular 19** da plataforma **Certifique-se**.

Para a documentação completa do projeto, arquitetura, endpoints da API e guia detalhado, consulte o [README principal da raiz](../README.md).

---

## 🚀 Guia Rápido de Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar Servidor Local

```bash
npm start
# ou
ng serve
```

Acesse em: `http://localhost:4200/`

### 3. Configuração de API

O endpoint da API é configurado em `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080"
};
```

---

## 📜 Comandos Úteis

| Comando | Ação |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento na porta `4200` |
| `npm run build` | Compila a aplicação para produção em `dist/` |
| `npm run watch` | Compilação com monitoramento em tempo real |
| `npm test` | Executa os testes unitários via Karma/Jasmine |
| `ng generate component <nome>` | Cria um novo componente via Angular CLI |

---

## 🛠️ Stack Principal

- **Angular 19** (Standalone Components, Signals, Router, Forms, HTTP Interceptors)
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **Lucide Angular** (`@lucide/angular`)
- **PDF.js** (`pdfjs-dist`)
- **TypeScript 5.7**
