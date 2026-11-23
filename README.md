# Certifique-se — Web

**Certifique-se** é uma plataforma web centralizada para organizar, preservar e apresentar certificados acadêmicos e profissionais. O sistema permite que estudantes e profissionais construam um acervo estruturado de suas conquistas, contabilizem horas complementares e disponibilizem uma vitrine pública compartilhável (`/u/:username`).

---

## Sobre o Projeto

Certificados de cursos, eventos, bootcamps e qualificações costumam ficar espalhados em diferentes plataformas, pastas locais ou e-mails. O **Certifique-se** resolve essa fragmentação oferecendo um ambiente único onde o usuário cataloga seus documentos comprobatórios, extrai e registra metadados relevantes (carga horária, instituição, data de conclusão, URL de verificação e tags de competência) e disponibiliza um portfólio público verificado para recrutadores e instituições de ensino.

---

## Principais Funcionalidades

- **Dashboard Analítico:** Visão consolidada do acervo com métricas em tempo real de total de certificados, horas complementares acumuladas, distribuição por áreas de conhecimento e conquistas recentes.
- **Gestão Completa de Certificados:** Cadastro, edição, visualização detalhada e exclusão de certificados com upload de imagens e suporte nativo a arquivos PDF com geração de *thumbnails* via **PDF.js**.
- **Extração Inteligente & Metadados:** Suporte a preenchimento assistido por IA (Gemini) para leitura de certificados, além do registro de instituição emissora, data de conclusão, carga horária, link externo de autenticidade e tags de competências.
- **Busca e Filtragem Avançada:** Pesquisa dinâmica por título, instituição, habilidade/tag e ano de conclusão.
- **Vitrine Pública (`/u/:username`):** Página pública de perfil profissional para compartilhamento de certificados marcados como públicos, permitindo controlar individualmente a visibilidade de cada documento.
- **Segurança, Perfil & Administração:** Autenticação via JWT com guards de rota (`authGuard`, `guestGuard` e `adminGuard`), recuperação/redefinição de senha por e-mail, gestão de perfil e painel administrativo (`/admin`) para gerenciamento de usuários e métricas do sistema.

---

## Arquitetura da Aplicação

O repositório está organizado com a aplicação principal em **Angular 19** (`certifique-se/`) e a versão anterior em **React 19** (`react-backup/`):

```text
certifique-se-web/
├── certifique-se/                  # Aplicação principal (Angular 19)
│   └── src/
│       ├── app/
│       │   ├── core/               # Guards (auth, guest, admin), Interceptors JWT, Models e Services de API
│       │   ├── features/           # Módulos de páginas (landing, auth, dashboard, certificates, profile, public-profile, admin)
│       │   └── shared/             # Componentes, diretivas e utilitários compartilhados
│       ├── environments/           # Configurações de ambiente e URL da API
│       └── styles.css              # Estilos globais e configuração do Tailwind CSS v4
└── react-backup/                   # Implementação anterior em React 19 + Vite
```

### Rotas da Interface

| Escopo | Rota | Descrição |
| :--- | :--- | :--- |
| **Público** | `/` | Landing page institucional com apresentação da plataforma |
| **Público** | `/u/:username` | Portfólio público de certificados do usuário |
| **Visitante** | `/login` | Autenticação de usuários registrados |
| **Visitante** | `/cadastro` | Criação de nova conta e definição de nome de usuário |
| **Visitante** | `/esqueci-senha` | Solicitação de recuperação de acesso por e-mail |
| **Visitante** | `/redefinir-senha` | Redefinição de senha com token de segurança |
| **Autenticado** | `/dashboard` | Painel de indicadores, horas acumuladas e certificados recentes |
| **Autenticado** | `/certificados` | Catálogo completo com busca textual e filtros combinados |
| **Autenticado** | `/certificados/novo` | Formulário de inclusão, upload e leitura de novo certificado |
| **Autenticado** | `/certificados/:hash` | Visualização completa do documento, credenciais e metadados |
| **Autenticado** | `/certificados/:hash/editar` | Atualização de dados e visibilidade do certificado |
| **Autenticado** | `/perfil` | Edição de informações do titular, alteração de senha e conta |
| **Admin** | `/admin` | Painel administrativo para gerenciamento do sistema e usuários |

---

## Stack Tecnológica

- **Framework Principal:** Angular 19 (Standalone Components, Signals & Lazy Loading)
- **Linguagem:** TypeScript 5.7
- **Estilização:** Tailwind CSS 4 (`@tailwindcss/postcss`)
- **Programação Reativa:** RxJS 7.8
- **Renderização de PDF:** PDF.js (`pdfjs-dist`)
- **Iconografia:** Lucide Angular (`@lucide/angular`)
