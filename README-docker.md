# Docker Compose para PostgreSQL

Este projeto inclui uma configuração Docker Compose para executar PostgreSQL localmente.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database Configuration
DB_NAME=drinking
DB_PASSWORD=your_secure_password_here
DB_PORT=5432

# PgAdmin Configuration (opcional)
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=8080

# Database URL (compatível com o script existente)
DATABASE_URL=postgresql://postgres:your_secure_password_here@localhost:5432/drinking
```

### 2. Comandos Básicos

#### Iniciar apenas o PostgreSQL:

```bash
docker-compose up -d postgres
```

#### Iniciar PostgreSQL + PgAdmin:

```bash
docker-compose --profile admin up -d
```

#### Parar os serviços:

```bash
docker-compose down
```

#### Parar e remover volumes (dados serão perdidos):

```bash
docker-compose down -v
```

#### Ver logs:

```bash
docker-compose logs postgres
docker-compose logs pgadmin
```

### 3. Acesso aos Serviços

- **PostgreSQL**: `localhost:5432` (ou a porta configurada em `DB_PORT`)
- **PgAdmin** (se habilitado): `http://localhost:8080` (ou a porta configurada em `PGADMIN_PORT`)

### 4. Scripts de Inicialização (Opcional)

Você pode adicionar scripts SQL para serem executados na criação do banco:

1. Crie a pasta `init-scripts/` na raiz do projeto
2. Adicione arquivos `.sql` que serão executados em ordem alfabética
3. Exemplo: `init-scripts/01-create-tables.sql`

### 5. Persistência de Dados

Os dados do PostgreSQL são persistidos no volume `postgres_data`. Para fazer backup:

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres drinking > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres drinking < backup.sql
```

## Vantagens sobre o Script Shell

- **Declarativo**: Configuração em YAML, mais fácil de ler e manter
- **Persistência**: Dados são mantidos entre restarts
- **Health Checks**: Verifica se o serviço está saudável
- **Networks**: Isolamento de rede adequado
- **Profiles**: Pode incluir serviços opcionais (como PgAdmin)
- **Escalabilidade**: Fácil adicionar outros serviços (Redis, etc.)

## Compatibilidade

Este docker-compose é compatível com o seu script `start-database.sh` existente, usando as mesmas variáveis de ambiente.
