# Drinking App - Sistema de Gerenciamento de Bebedouros

Sistema completo para gerenciamento de bebedouros de água, desenvolvido com a [T3 Stack](https://create.t3.gg/). Permite o cadastro, monitoramento, manutenção e coleta de feedback sobre bebedouros em instituições.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Dados](#estrutura-de-dados)
- [API e Rotas](#api-e-rotas)
- [Testes](#testes)
- [Deploy](#deploy)

## 🎯 Sobre o Projeto

O **Drinking App** é uma aplicação web desenvolvida para facilitar o gerenciamento de bebedouros de água em instituições. O sistema oferece funcionalidades para administradores gerenciarem bebedouros, realizar manutenções e coletar feedback dos usuários através de uma interface pública acessível via QR Code.

## ✨ Funcionalidades

### Para Administradores

- **Dashboard**: Visualização de estatísticas gerais do sistema
  - Total de bebedouros cadastrados
  - Bebedouros ativos, inativos e em manutenção
  - Gráficos e métricas de uso

- **Gerenciamento de Bebedouros**
  - Cadastro, edição e exclusão de bebedouros
  - Visualização em tabela com filtros e busca
  - Controle de status (Ativo, Inativo, Em Manutenção)
  - Geração de QR Code para acesso público

- **Sistema de Manutenção**
  - Kanban board para gerenciamento de manutenções
  - Criação de ordens de serviço
  - Atribuição de responsáveis
  - Acompanhamento de status (Pendente, Em Progresso, Concluído)
  - Categorização de serviços de manutenção

- **Autenticação e Autorização**
  - Sistema de login seguro
  - Controle de acesso por roles (ADMIN, WORKER)
  - Gerenciamento de sessões

### Para Usuários Públicos

- **Acesso via QR Code**: Acesso rápido a informações do bebedouro
- **Feedback**: Envio de feedback sobre bebedouros
  - Tipos: Problema, Sugestão, Elogio, Outro
  - Sistema de avaliação por estrelas (1-5)
  - Campos opcionais de nome e email

- **Operação de Manutenção** (para usuários autenticados)
  - Interface para registro de serviços realizados
  - Checklist de serviços por categoria
  - Observações e notas

## 🛠 Tecnologias

### Core
- **[Next.js 15](https://nextjs.org)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[React 19](https://react.dev/)** - Biblioteca UI

### Backend & API
- **[tRPC](https://trpc.io)** - API type-safe end-to-end
- **[Prisma](https://www.prisma.io/)** - ORM para banco de dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Better Auth](https://www.better-auth.com/)** - Sistema de autenticação

### UI & Estilização
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[Recharts](https://recharts.org/)** - Gráficos e visualizações

### Formulários & Validação
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Resolvers para validação

### Outras Ferramentas
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado servidor
- **[TanStack Table](https://tanstack.com/table)** - Tabelas avançadas
- **[Cypress](https://www.cypress.io/)** - Testes end-to-end
- **[Docker](https://www.docker.com/)** - Containerização

## 📁 Estrutura do Projeto

```
drinking/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed/                   # Scripts de seed
├── src/
│   ├── app/                    # Rotas Next.js (App Router)
│   │   ├── (public)/           # Rotas públicas
│   │   │   └── bebedouro/      # Página pública do bebedouro
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # Rotas de autenticação
│   │   │   └── trpc/           # Endpoint tRPC
│   │   ├── app/                # Área autenticada
│   │   │   ├── bebedouros/     # Gerenciamento de bebedouros
│   │   │   ├── novo/           # Criar novo bebedouro
│   │   │   └── page.tsx        # Lista de bebedouros
│   │   ├── operacao/           # Kanban de manutenção
│   │   └── page.tsx            # Dashboard
│   │   ├── entrar/             # Página de login
│   │   └── login/              # Alternativa de login
│   ├── components/             # Componentes React
│   │   ├── app/                # Componentes da área autenticada
│   │   │   ├── bebedouros/     # Componentes de bebedouros
│   │   │   ├── dashboard/      # Componentes do dashboard
│   │   │   ├── kanban/         # Componentes do Kanban
│   │   │   └── stat-card.tsx   # Card de estatísticas
│   │   ├── public/             # Componentes públicos
│   │   │   └── sink/           # Componentes de bebedouro público
│   │   ├── shell/              # Componentes de layout
│   │   │   ├── app-header.tsx  # Header da área autenticada
│   │   │   ├── app-sidebar.tsx # Sidebar da área autenticada
│   │   │   └── sidebar/        # Componentes da sidebar
│   │   └── ui/                 # Componentes UI base
│   ├── server/                 # Código do servidor
│   │   ├── api/                # Routers tRPC
│   │   │   ├── routers/        # Routers específicos
│   │   │   │   ├── sink.ts     # Router de bebedouros
│   │   │   │   ├── maintance.ts # Router de manutenções
│   │   │   │   ├── operation.ts # Router de operações
│   │   │   │   ├── dahsboard.ts # Router do dashboard
│   │   │   │   └── user.ts      # Router de usuários
│   │   │   ├── root.ts         # Router raiz
│   │   │   └── trpc.ts         # Configuração tRPC
│   │   └── auth/               # Configuração de autenticação
│   ├── trpc/                   # Configuração tRPC
│   │   ├── react.tsx           # Provider React
│   │   ├── query-client.ts     # Query client
│   │   └── server.ts           # Utilitários servidor
│   ├── utils/                  # Utilitários
│   │   ├── validators/         # Validadores Zod
│   │   │   ├── sink/           # Validadores de bebedouros
│   │   │   ├── maintenance/    # Validadores de manutenção
│   │   │   └── auth/           # Validadores de autenticação
│   │   └── types/              # Tipos TypeScript
│   └── styles/                 # Estilos globais
├── cypress/                    # Testes E2E
│   ├── e2e/                    # Testes end-to-end
│   ├── component/              # Testes de componentes
│   └── fixtures/               # Dados de teste
├── public/                     # Arquivos estáticos
├── docker-compose.yml          # Configuração Docker
└── Dockerfile                  # Dockerfile da aplicação
```

## 📦 Pré-requisitos

- **Node.js** 18+ ou superior
- **pnpm** 9+ (gerenciador de pacotes)
- **PostgreSQL** 15+ (ou Docker para rodar via docker-compose)
- **Git**

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd drinking
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

4. **Configure o arquivo `.env`** com suas credenciais (veja [Configuração](#configuração))

5. **Inicie o banco de dados** (usando Docker)
```bash
docker-compose up -d postgres
```

Ou use o script fornecido:
```bash
./start-database.sh
```

6. **Execute as migrações do banco de dados**
```bash
pnpm db:generate
```

7. **Popule o banco com dados iniciais** (opcional)
```bash
pnpm db:seed
```

8. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/drinking?schema=public"

# Autenticação (Better Auth)
BETTER_AUTH_SECRET="sua-chave-secreta-aqui"
BETTER_AUTH_URL="http://localhost:3000"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Configuração do Docker

O projeto inclui um `docker-compose.yml` com:
- **PostgreSQL**: Banco de dados principal
- **PgAdmin** (opcional): Interface web para administração do banco

Para iniciar apenas o PostgreSQL:
```bash
docker-compose up -d postgres
```

Para incluir o PgAdmin:
```bash
docker-compose --profile admin up -d
```

## 📖 Uso

### Acessando o Sistema

1. **Página Inicial**: `http://localhost:3000`
   - Acesso público com links para login e área de bebedouros

2. **Login**: `http://localhost:3000/entrar`
   - Faça login com suas credenciais de administrador

3. **Dashboard**: `http://localhost:3000/app`
   - Visualize estatísticas gerais do sistema

4. **Bebedouros**: `http://localhost:3000/app/bebedouros`
   - Gerencie todos os bebedouros cadastrados
   - Crie novos bebedouros em `/app/bebedouros/novo`

5. **Manutenção**: `http://localhost:3000/app/operacao`
   - Acesse o Kanban de manutenções
   - Visualize e gerencie ordens de serviço

### Página Pública do Bebedouro

Cada bebedouro possui uma página pública acessível via:
```
http://localhost:3000/bebedouro/[sinkId]
```

Esta página pode ser acessada via QR Code gerado no sistema e permite:
- Visualizar informações do bebedouro
- Enviar feedback (problemas, sugestões, elogios)
- Para usuários autenticados: realizar operações de manutenção

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento com Turbo
pnpm build            # Build de produção
pnpm start            # Inicia servidor de produção
pnpm preview          # Build e inicia servidor de produção

# Banco de Dados
pnpm db:generate      # Gera migrações Prisma
pnpm db:migrate       # Aplica migrações em produção
pnpm db:push          # Sincroniza schema com banco (desenvolvimento)
pnpm db:studio        # Abre Prisma Studio (interface visual do banco)

# Qualidade de Código
pnpm lint             # Executa ESLint
pnpm lint:fix         # Corrige problemas do ESLint
pnpm format:check     # Verifica formatação Prettier
pnpm format:write     # Formata código com Prettier
pnpm typecheck        # Verifica tipos TypeScript
pnpm check            # Executa lint e typecheck

# Testes
pnpm cy:open          # Abre Cypress em modo interativo
pnpm cy:e2e           # Executa testes E2E (com servidor)
pnpm cy:e2e:ci        # Executa testes E2E (CI)
```

## 🗄 Estrutura de Dados

### Principais Entidades

#### Sink (Bebedouro)
- `id`: Identificador único (CUID)
- `name`: Nome do bebedouro
- `location`: Localização física
- `description`: Descrição
- `status`: ACTIVE | INACTIVE | MAINTANCE
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- Relacionamentos: `sinkMaintances`, `feedbacks`

#### SinkFeedback (Feedback)
- `id`: Identificador único (CUID)
- `sinkId`: Referência ao bebedouro
- `type`: PROBLEM | SUGGESTION | COMPLIMENT | OTHER
- `message`: Mensagem do feedback (texto)
- `rating`: Avaliação de 1-5 estrelas (opcional)
- `name`: Nome do usuário (opcional)
- `email`: Email do usuário (opcional)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

#### SinkMaintance (Manutenção)
- `id`: Identificador único (CUID)
- `sinkId`: Referência ao bebedouro
- `responsableId`: Referência ao usuário responsável
- `status`: PENDING | IN_PROGRESS | CONCLUDED
- `observations`: Observações da manutenção (opcional)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- Relacionamentos: `responsable`, `sink`, `sinkMaintanceServices`

#### SinkMaintanceService (Serviço de Manutenção)
- `id`: Identificador único (auto-incremento)
- `name`: Nome do serviço
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

#### User (Usuário)
- `id`: Identificador único
- `name`: Nome do usuário
- `email`: Email (único)
- `role`: ADMIN | WORKER
- `emailVerified`: Status de verificação
- `image`: URL da imagem de perfil (opcional)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- Relacionamentos: `sessions`, `accounts`, `sinkMaintances`

## 🔌 API e Rotas

### tRPC Routers

O sistema utiliza tRPC para comunicação type-safe entre cliente e servidor:

#### `sinkRouter` - Gerenciamento de Bebedouros
- `create`: Criar novo bebedouro (protegido)
  - Input: `name`, `location`, `description`
  - Retorna: Bebedouro criado
  
- `list`: Listar todos os bebedouros com estatísticas (protegido)
  - Retorna: Lista de bebedouros + contadores (ativos, inativos, em manutenção)
  
- `getById`: Buscar bebedouro por ID (público)
  - Input: `id`
  - Retorna: Dados do bebedouro
  
- `createFeedback`: Criar feedback público (público)
  - Input: `sinkId`, `type`, `message`, `rating?`, `name?`, `email?`
  - Retorna: Feedback criado

#### `maintanceRouter` - Gerenciamento de Manutenções
- `create`: Criar ordem de manutenção (protegido)
  - Input: `sinkId`, `responsableId`, `observations?`, `sinkMaintanceServices`
  
- `services`: Listar serviços disponíveis (protegido)
  - Retorna: Lista de serviços de manutenção

#### `operationRouter` - Operações de Manutenção
- `list`: Listar manutenções agrupadas por status (protegido)
  - Retorna: Objeto com manutenções agrupadas por status (PENDING, IN_PROGRESS, CONCLUDED)
  - Usado para popular o Kanban board

#### `dashboardRouter` - Dados do Dashboard
- `list`: Estatísticas gerais (público)
  - Retorna: `totalSinks`, `inMaintanceSinks`, `activeSinks`

#### `userRouter` - Gerenciamento de Usuários
- Rotas para gerenciamento de usuários do sistema

### API Routes

- **`/api/auth/[...all]`**: Rotas de autenticação (Better Auth)
  - Login, logout, registro, verificação de email
  
- **`/api/trpc/[trpc]`**: Endpoint tRPC
  - Todas as rotas tRPC são acessadas através deste endpoint
  
- **`/api/openapi.json`**: Documentação OpenAPI (se configurado)

## 🧪 Testes

O projeto utiliza **Cypress** para testes end-to-end.

### Executando Testes

```bash
# Modo interativo (com interface gráfica)
pnpm cy:open

# Executar todos os testes
pnpm cy:e2e

# Executar em modo CI
pnpm cy:e2e:ci
```

### Estrutura de Testes

```
cypress/
├── e2e/              # Testes end-to-end
│   ├── login.cy.ts   # Testes de autenticação
│   └── create-sink.cy.ts # Testes de criação de bebedouros
├── component/        # Testes de componentes
├── fixtures/         # Dados de teste
│   └── example.json
└── support/         # Comandos e configurações customizadas
    ├── commands.ts   # Comandos customizados
    └── e2e.ts        # Configuração E2E
```

### Testes Disponíveis

- **Login**: Testa o fluxo de autenticação
- **Create Sink**: Testa a criação de bebedouros

## 🚢 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `NEXT_PUBLIC_APP_URL`
3. Configure o banco de dados (Vercel Postgres ou externo)
4. Deploy automático a cada push

### Docker

O projeto inclui um `Dockerfile` para containerização:

```bash
# Build da imagem
docker build -t drinking-app .

# Executar container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e BETTER_AUTH_SECRET="..." \
  drinking-app
```

Ou use o docker-compose completo:
```bash
docker-compose up -d
```

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**

Certifique-se de configurar:
- Variáveis de ambiente
- Banco de dados PostgreSQL
- Build command: `pnpm build`
- Start command: `pnpm start`

## 📚 Recursos Adicionais

- [Documentação T3 Stack](https://create.t3.gg/)
- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ usando a T3 Stack**
