# Certifique-se — Frontend (React)

**Certifique-se** é uma plataforma web centralizada para organizar, preservar e apresentar certificados acadêmicos e profissionais. O sistema permite que estudantes e profissionais construam um acervo estruturado de suas conquistas, com controle de visibilidade e uma vitrine pública compartilhável (`/u/:username`).

---

## Sobre o Projeto

Certificados de cursos, eventos, bootcamps e qualificações costumam ficar espalhados em diferentes plataformas, pastas locais ou e-mails. O **Certifique-se** resolve essa fragmentação oferecendo um ambiente único onde o usuário cataloga seus documentos comprobatórios, adiciona metadados relevantes (carga horária, instituição, código de credencial, URL de verificação e tags de competência) e disponibiliza um portfólio público verificado para recrutadores e instituições.

---

## Principais Funcionalidades

- **Dashboard Analítico:** Visão consolidada do acervo com métricas de total de certificados, instituições emissoras, competências mapeadas (tags) e conquistas recentes.
- **Gestão Completa de Certificados:** Cadastro, edição, visualização detalhada e exclusão de certificados com suporte a upload e pré-visualização de arquivos (PDF e imagens).
- **Metadados & Rastreabilidade:** Registro de instituição emissora, data de conclusão, carga horária, código de credencial, link externo de validação e descrição das competências adquiridas.
- **Busca e Filtragem Avançada:** Pesquisa instantânea por título, instituição ou habilidade, combinada com filtros dinâmicos por instituição emissora, tag e ano de conclusão.
- **Vitrine Pública (`/u/:username`):** Página pública de perfil profissional para compartilhamento de certificados marcados como públicos, permitindo controlar individualmente a privacidade de cada documento.
- **Personalização & Experiência do Usuário:** Interface responsiva com suporte nativo a tema claro e escuro (*Light/Dark Mode*), notificações contextuais e navegação fluida.

---

## Arquitetura da Aplicação

O frontend foi projetado como uma *Single Page Application* (SPA) modular em React e TypeScript, organizada por domínios funcionais:

```text
src/
├── components/
│   ├── layouts/         # Estruturas de página (PublicLayout e AuthenticatedLayout)
│   └── shared/          # Componentes reutilizáveis (Cards, Upload, Sidebar, Header, Modais, Filtros)
├── context/             # Provedores de estado global (Roteamento SPA e Tema Light/Dark)
├── pages/
│   ├── public/          # Landing Page, Autenticação (Login, Cadastro, Recuperação) e Perfil Público
│   └── authenticated/   # Dashboard, Listagem, Formulário de Certificado, Detalhes, Perfil e Configurações
├── services/            # Camada de serviços e gerenciamento de estado (Autenticação, Certificados e Toasts)
└── types/               # Contratos e interfaces TypeScript do domínio (Certificate, User, Tag, StatSummary)
```

### Rotas da Interface

| Escopo | Rota | Descrição |
| :--- | :--- | :--- |
| **Público** | `/` | Landing page institucional com apresentação da plataforma |
| **Público** | `/login` | Autenticação de usuários registrados |
| **Público** | `/cadastro` | Criação de nova conta e definição de nome de usuário |
| **Público** | `/esqueci-senha` | Fluxo de recuperação de acesso |
| **Público** | `/u/:username` | Portfólio público de certificados do usuário |
| **Autenticado** | `/dashboard` | Painel de indicadores e acesso rápido aos certificados recentes |
| **Autenticado** | `/certificados` | Catálogo completo com busca textual e filtros combinados |
| **Autenticado** | `/certificados/novo` | Formulário de inclusão e upload de novo certificado |
| **Autenticado** | `/certificados/:id` | Visualização completa do documento, credenciais e metadados |
| **Autenticado** | `/certificados/:id/editar` | Atualização de dados e visibilidade do certificado |
| **Autenticado** | `/perfil` | Edição de informações públicas do titular (bio, título, avatar) |
| **Autenticado** | `/configuracoes` | Preferências da conta, visibilidade do perfil e gerenciamento de dados |

---

## Stack Tecnológica

- **Biblioteca Principal:** React 19
- **Linguagem:** TypeScript 5.8
- **Estilização:** Tailwind CSS 4
- **Animações e Transições:** Motion (`motion`)
- **Iconografia:** Lucide React (`lucide-react`)
- **Bundler:** Vite 6
