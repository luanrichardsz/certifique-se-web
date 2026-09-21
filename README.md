# 🎓 Certifique-se (Web)

> **Plataforma moderna para organização, validação e exibição pública de certificados e horas complementares.**

![Angular 19](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PDF.js](https://img.shields.io/badge/PDF.js-Integrated-FF5722?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)

---

## 📌 Sobre o Projeto

O **Certifique-se Web** é uma aplicação Single Page Application (SPA) desenvolvida em **Angular 19** que resolve o problema de desorganização de certificados, diplomas e comprovantes de cursos. 

A plataforma permite que estudantes e profissionais centralizem seus certificados em um único lugar, contabilizem automaticamente horas complementares de capacitação e compartilhem um portfólio público verificado através de um link personalizado (`/u/:username`), ideal para anexar em currículos e redes profissionais como o LinkedIn.

---

## ✨ Principais Funcionalidades

- **🗂️ Gestão Completa de Certificados**:
  - Cadastro detalhado: título, instituição/emissora, data de conclusão, carga horária, tags de habilidades, descrição e link de autenticidade oficial.
  - Upload de imagens e suporte nativo a arquivos PDF com geração automática de thumbnails em tempo real via **PDF.js**.
  - Definição de visibilidade: escolha entre certificados públicos ou privados.

- **🔗 Portfólio Público (`/u/:username`)**:
  - Página pública personalizada e responsiva com o perfil do usuário, bio, links sociais e galeria de certificados públicos.
  - Facilidade de compartilhamento para recrutadores e instituições de ensino.

- **📊 Dashboard Interativo**:
  - Métricas em tempo real: total de horas complementares acumuladas, número de certificados emitidos e distribuição por áreas de conhecimento.

- **🔍 Busca e Filtragem Inteligente**:
  - Filtros dinâmicos por nome, instituição, tags/habilidades e ano de conclusão.

- **🔐 Autenticação e Segurança**:
  - Fluxo completo com JWT (Login, Cadastro, Recuperação de Senha com Token).
  - Proteção de rotas com Guards funcionais (`authGuard` e `guestGuard`).
  - Interceptor HTTP automático para injeção de tokens `Bearer` nas requisições à API.
  - Cada certificado possui um hash único para integridade e rastreabilidade.

- **👤 Gestão de Perfil**:
  - Atualização de dados cadastrais, alteração de senha segura e exclusão de conta.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: [Angular 19](https://angular.dev/) (Standalone Components, Signals e Zoneless/Zone.js)
- **Linguagem**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com `@tailwindcss/postcss`
- **Ícones**: [Lucide Angular](https://lucide.dev/)
- **Manipulação de PDF**: [PDF.js](https://mozilla.github.io/pdf.js/) (`pdfjs-dist`)
- **Programação Reativa**: [RxJS 7.8](https://rxjs.dev/)
- **Testes**: Karma & Jasmine

---

## 📁 Estrutura do Repositório

```text
certifique-se-web/
├── certifique-se/                  # Aplicação Angular 19 principal
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # Núcleo da aplicação
│   │   │   │   ├── guards/         # Proteções de rotas (auth, guest)
│   │   │   │   ├── interceptors/   # Interceptors HTTP (token JWT)
│   │   │   │   ├── models/         # Interfaces e DTOs tipados
│   │   │   │   └── services/       # Serviços de API (auth, certificados, perfil, thumbnails)
│   │   │   ├── features/           # Módulos funcionais e páginas
│   │   │   │   ├── auth/           # Login, Cadastro, Esqueci/Redefinir Senha
│   │   │   │   ├── certificates/   # Listagem, Criação, Detalhes e Edição
│   │   │   │   ├── dashboard/      # Painel de métricas e visão geral
│   │   │   │   ├── landing/        # Página inicial pública
│   │   │   │   ├── profile/        # Edição de perfil do usuário
│   │   │   │   └── public-profile/ # Portfólio público (/u/:username)
│   │   │   └── shared/             # Componentes, pipes e diretivas reutilizáveis
│   │   ├── environments/           # Configuração de URLs e variáveis de ambiente
│   │   └── styles.css              # Estilos globais e importações do Tailwind CSS
│   ├── angular.json                # Configurações do Angular CLI
│   └── package.json                # Dependências e scripts do projeto Angular
│
├── react-backup/                   # Versão anterior da aplicação em React (legado)
└── README.md                       # Documentação principal
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18.x ou superior recomendada)
- [npm](https://www.npmjs.com/) (ou yarn/pnpm)
- [Angular CLI](https://angular.dev/tools/cli) (opcional, mas recomendado):
  ```bash
  npm install -g @angular/cli
  ```

### 1. Clonar o repositório

```bash
git clone https://github.com/luanrichardsz/certifique-se-web.git
cd certifique-se-web
```

### 2. Acessar o diretório da aplicação e instalar as dependências

```bash
cd certifique-se
npm install
```

### 3. Configurar o Ambiente da API

Por padrão, a aplicação conecta-se ao backend em `http://localhost:8080`. Se necessário, ajuste o arquivo de configuração em `certifique-se/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080" // Altere para a URL do seu backend
};
```

### 4. Executar o servidor de desenvolvimento

```bash
npm start
# ou
ng serve
```

Abra seu navegador em [http://localhost:4200/](http://localhost:4200/). A aplicação recarregará automaticamente sempre que qualquer arquivo de origem for modificado.

---

## 📜 Scripts Disponíveis

Dentro do diretório `certifique-se/`:

| Comando | Descrição |
|---|---|
| `npm start` / `ng serve` | Inicia o servidor local de desenvolvimento na porta `4200` |
| `npm run build` / `ng build` | Compila o projeto otimizado para produção na pasta `dist/` |
| `npm run watch` | Compila e monitora alterações contínuas em modo de desenvolvimento |
| `npm test` / `ng test` | Executa a suíte de testes unitários com Karma e Jasmine |

---

## 🤝 Integração com o Backend

A aplicação se comunica com o backend RESTful nos seguintes endpoints principais:

- **Autenticação**:
  - `POST /auth/login` - Autenticação e obtenção do token JWT
  - `POST /auth/esqueci-senha` - Solicitação de redefinição de senha
  - `POST /auth/redefinir-senha` - Redefinição de senha com token
- **Usuários**:
  - `POST /usuarios` - Cadastro de novo usuário
  - `GET /usuarios/me` - Perfil do usuário autenticado
  - `PUT /usuarios/me` - Atualização de perfil
  - `PUT /usuarios/me/senha` - Alteração de senha
  - `DELETE /usuarios/me` - Exclusão de conta
- **Certificados**:
  - `GET /certificados/me` - Listagem com filtros
  - `POST /certificados` - Criação de certificado
  - `PUT /certificados/:hash` - Atualização
  - `DELETE /certificados/:hash` - Exclusão
  - `POST /certificados/imagens` - Upload de anexo/comprovante
- **Público**:
  - `GET /public/usuarios/:username` - Dados públicos do perfil
  - `GET /public/usuarios/:username/certificados` - Lista de certificados públicos

---

## 📄 Licença

Este projeto está sob a licença correspondente definida pelo repositório principal. Para mais informações, consulte a organização do projeto.