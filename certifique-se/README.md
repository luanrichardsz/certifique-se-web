# Certifique-se — Frontend (Angular)

Aplicação Single Page Application (SPA) em **Angular 19** do **Certifique-se**, plataforma centralizada para organizar, validar e compartilhar certificados acadêmicos e profissionais.

---

## Estrutura do Módulo (`src/app`)

```text
src/app/
├── core/
│   ├── guards/          # Proteção de rotas (authGuard, guestGuard, adminGuard)
│   ├── interceptors/    # Injeção automática de token Bearer JWT nas requisições HTTP
│   ├── models/          # Contratos e interfaces TypeScript (User, Certificate, Auth, Admin)
│   └── services/        # Integração com a API REST e renderização de thumbnails PDF
├── features/
│   ├── admin/           # Painel de administração do sistema e gestão de usuários
│   ├── auth/            # Login, Cadastro, Esqueci Senha e Redefinir Senha
│   ├── certificates/    # Listagem, Cadastro, Visualização e Edição de certificados
│   ├── dashboard/       # Visão analítica de certificados, horas e competências
│   ├── landing/         # Página institucional pública
│   ├── profile/         # Gerenciamento de perfil, senha e configurações da conta
│   └── public-profile/  # Vitrine pública compartilhável (/u/:username)
└── shared/              # Componentes reutilizáveis (Navbar, Cards, Modais, Inputs)
```

---

## Scripts de Desenvolvimento

No diretório `certifique-se/`:

| Comando | Descrição |
| :--- | :--- |
| `npm install` | Instala as dependências do projeto |
| `npm start` ou `ng serve` | Inicia o servidor de desenvolvimento em `http://localhost:4200/` |
| `npm run build` | Gera o build otimizado de produção em `dist/certifique-se/browser/` |
| `npm run watch` | Compila continuamente em modo de desenvolvimento |
| `npm test` | Executa os testes unitários via Karma e Jasmine |
