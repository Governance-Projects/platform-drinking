# 📖 Documentação da API - Drinking App

Este documento descreve a API REST gerada automaticamente a partir do tRPC usando OpenAPI/Swagger.

## 🚀 Acesso à Documentação

### Interface Swagger UI

```
http://localhost:3001/api-docs
```

### Schema OpenAPI JSON

```
http://localhost:3001/api/openapi.json
```

## 🛠️ Tecnologias

- **tRPC v11** - Framework TypeScript para APIs
- **OpenAPI 3.0** - Especificação padrão para APIs REST
- **Swagger UI** - Interface interativa para documentação
- **Zod** - Validação de schemas TypeScript-first
- **Prisma** - ORM para banco de dados
- **NextAuth.js** - Autenticação

## 📋 Endpoints Disponíveis

### 🏷️ Bebedouros

| Método   | Endpoint                | Descrição                     | Auth |
| -------- | ----------------------- | ----------------------------- | ---- |
| `GET`    | `/api/bebedouros`       | Listar bebedouros com filtros | ❌   |
| `GET`    | `/api/bebedouros/{id}`  | Buscar bebedouro por ID       | ❌   |
| `GET`    | `/api/bebedouros/stats` | Estatísticas dos bebedouros   | ❌   |
| `POST`   | `/api/bebedouros`       | Criar novo bebedouro          | ✅   |
| `PUT`    | `/api/bebedouros/{id}`  | Atualizar bebedouro           | ✅   |
| `DELETE` | `/api/bebedouros/{id}`  | Deletar bebedouro             | ✅   |

### 📝 Posts (Exemplo T3 Stack)

| Método | Endpoint            | Descrição              | Auth |
| ------ | ------------------- | ---------------------- | ---- |
| `GET`  | `/api/posts/hello`  | Saudação personalizada | ❌   |
| `GET`  | `/api/posts/latest` | Último post do usuário | ✅   |
| `GET`  | `/api/posts/secret` | Mensagem secreta       | ✅   |
| `POST` | `/api/posts`        | Criar novo post        | ✅   |

## 🔐 Autenticação

### Obter Token JWT

A API utiliza NextAuth.js para autenticação. Para acessar endpoints protegidos:

1. **Fazer login via NextAuth.js**:

   ```
   GET /api/auth/signin
   ```

2. **Usar o token JWT** nos headers:
   ```http
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

### Testando no Swagger UI

1. Acesse `/api-docs`
2. Clique em "Authorize" (🔒)
3. Digite: `Bearer YOUR_JWT_TOKEN`
4. Clique em "Authorize"

## 📊 Exemplos de Uso

### Listar Bebedouros

```bash
curl -X GET "http://localhost:3001/api/bebedouros" \
  -H "Content-Type: application/json"
```

**Resposta:**

```json
{
  "bebedouros": [
    {
      "id": "cm123456789",
      "nome": "Bebedouro Principal",
      "localizacao": "Prédio A - Térreo",
      "status": "ATIVO",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "createdAt": "2024-01-15T10:30:00Z",
      "createdBy": {
        "name": "João Silva",
        "email": "joao@exemplo.com"
      }
    }
  ],
  "total": 1,
  "hasMore": false
}
```

### Criar Bebedouro

```bash
curl -X POST "http://localhost:3001/api/bebedouros" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nome": "Novo Bebedouro",
    "localizacao": "Prédio B - 1º Andar",
    "descricao": "Bebedouro próximo à biblioteca",
    "status": "ATIVO",
    "latitude": -23.5515,
    "longitude": -46.6343
  }'
```

### Buscar Estatísticas

```bash
curl -X GET "http://localhost:3001/api/bebedouros/stats" \
  -H "Content-Type: application/json"
```

**Resposta:**

```json
{
  "total": 10,
  "ativos": 8,
  "inativos": 1,
  "manutencao": 1,
  "criadosUltimos30Dias": 3
}
```

## 🔍 Filtros e Parâmetros

### Listar Bebedouros

**Query Parameters:**

- `status` - Filtrar por status (`ATIVO`, `INATIVO`, `MANUTENCAO`)
- `search` - Busca textual (nome, localização, descrição)
- `limit` - Limite de resultados (1-100, padrão: 10)
- `offset` - Deslocamento para paginação (padrão: 0)

**Exemplo:**

```
GET /api/bebedouros?status=ATIVO&search=biblioteca&limit=5&offset=0
```

## ⚠️ Códigos de Resposta

| Código | Descrição                               |
| ------ | --------------------------------------- |
| `200`  | Sucesso                                 |
| `201`  | Criado com sucesso                      |
| `400`  | Erro de validação (dados inválidos)     |
| `401`  | Não autorizado (token ausente/inválido) |
| `403`  | Acesso negado (sem permissão)           |
| `404`  | Recurso não encontrado                  |
| `500`  | Erro interno do servidor                |

## 🛡️ Validação de Dados

Todos os endpoints utilizam validação Zod:

### Criar/Atualizar Bebedouro

```typescript
{
  nome: string (1-255 chars), // obrigatório
  localizacao: string (1-255 chars), // obrigatório
  descricao?: string, // opcional
  status: "ATIVO" | "INATIVO" | "MANUTENCAO", // padrão: ATIVO
  latitude?: number (-90 a 90), // opcional
  longitude?: number (-180 a 180) // opcional
}
```

### Erros de Validação

```json
{
  "error": "Bad Request",
  "message": "Validation error",
  "details": [
    {
      "path": ["nome"],
      "message": "Nome é obrigatório"
    }
  ]
}
```

## 🎯 Boas Práticas

### 1. **Rate Limiting**

- Implemente rate limiting em produção
- Considere limites por usuário/IP

### 2. **Paginação**

- Use sempre `limit` e `offset` para listas grandes
- Máximo de 100 itens por página

### 3. **Filtros**

- Combine múltiplos filtros quando necessário
- Use busca textual para melhor UX

### 4. **Caching**

- Considere cache para dados estáticos
- Use ETags para cache condicional

### 5. **Monitoramento**

- Monitore performance dos endpoints
- Implemente logging estruturado

## 🐛 Troubleshooting

### Erro 401 - Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Token JWT inválido ou ausente"
}
```

**Solução:** Verifique se o token JWT está correto e não expirou.

### Erro 403 - Forbidden

```json
{
  "error": "Forbidden",
  "message": "Você não tem permissão para editar este bebedouro"
}
```

**Solução:** Apenas o criador pode editar/deletar seus próprios bebedouros.

### Erro 500 - Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "Erro interno do servidor"
}
```

**Solução:** Verifique os logs do servidor e configuração do banco de dados.

## 📚 Recursos Adicionais

### Documentação Relacionada

- [README Principal](./README.md)
- [Guia de UI/UX](./README-UI.md)
- [Docker Setup](./README-docker.md)

### Links Úteis

- [tRPC Documentation](https://trpc.io/docs)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Zod Documentation](https://zod.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)

### Desenvolvimento Local

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Gerar cliente Prisma
pnpm prisma generate

# Aplicar migrações
pnpm prisma db push

# Verificar tipos
pnpm typecheck
```

---

## 📞 Suporte

Para dúvidas sobre a API:

- 📧 Email: dev@drinking-app.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/drinking-app/issues)
- 📖 Docs: `/api-docs` (Swagger UI)

**Versão da API:** 1.0.0  
**Última atualização:** $(date +'%Y-%m-%d')
