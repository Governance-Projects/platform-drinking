import { DocsLayout } from "~/components/docs/DocsLayout";
import { DocsSection } from "~/components/docs/DocsSection";
import { ApiEndpoint } from "~/components/docs/ApiEndpoint";
import { InfoCard } from "~/components/docs/InfoCard";
import { CodeBlock } from "~/components/docs/CodeBlock";
import {
  Shield,
  Zap,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function ApiDocsPage() {
  return (
    <DocsLayout>
      {/* Overview Section */}
      <DocsSection
        id="overview"
        title="Visão Geral"
        description="A Drinking API fornece endpoints para gerenciar bebedouros de forma eficiente e segura."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoCard
            icon={Zap}
            title="Performance"
            description="API construída com tRPC para máxima performance e type-safety."
            variant="success"
          />
          <InfoCard
            icon={Shield}
            title="Segurança"
            description="Autenticação com Better Auth (email/senha) e validação com Zod."
            variant="default"
          />
          <InfoCard
            icon={Database}
            title="Banco de Dados"
            description="Integração com PostgreSQL via Prisma ORM."
            variant="default"
          />
          <InfoCard
            icon={Key}
            title="OpenAPI"
            description="Especificação OpenAPI 3.0 para documentação interativa."
            variant="default"
          />
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">Base URL</h3>
          <CodeBlock language="text" title="Endpoint Base">
            {process.env.NODE_ENV === "production"
              ? "https://drinking-app.vercel.app/api"
              : "http://localhost:3001/api"}
          </CodeBlock>
        </div>
      </DocsSection>

      {/* Authentication Section */}
      <DocsSection
        id="authentication"
        title="Autenticação"
        description="A API utiliza JWT (JSON Web Tokens) para autenticação de usuários."
      >
        <InfoCard
          icon={AlertTriangle}
          title="Token Requerido"
          description="Endpoints protegidos requerem um token JWT válido no header Authorization."
          variant="warning"
        />

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Como autenticar</h3>
            <CodeBlock
              language="bash"
              title="Exemplo de Requisição Autenticada"
            >
              {`curl -X POST "http://localhost:3001/api/bebedouros" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nome": "Bebedouro Central",
    "localizacao": "Praça Principal"
  }'`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Obter Token</h3>
            <p className="text-muted-foreground mb-3">
              A autenticação é feita através do Better Auth usando email e senha.
              Após o login, a sessão estará disponível através do hook useSession.
            </p>
            <CodeBlock language="javascript" title="Exemplo Next.js">
              {`import { useSession } from "~/server/auth/client";

function MyComponent() {
  const { data: session } = useSession();
  
  if (session?.user) {
    // Dados do usuário disponíveis em session.user
    const userId = session.user.id;
    const email = session.user.email;
  }
}`}
            </CodeBlock>
          </div>
        </div>
      </DocsSection>

      {/* Getting Started */}
      <DocsSection
        id="getting-started"
        title="Começando"
        description="Exemplos práticos para começar a usar a API rapidamente."
      >
        <div>
          <h3 className="mb-3 text-lg font-semibold">
            Exemplo Básico - Listar Bebedouros
          </h3>
          <CodeBlock language="bash" title="cURL">
            {`curl -X GET "http://localhost:3001/api/bebedouros?limit=5"`}
          </CodeBlock>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold">Resposta de Exemplo</h3>
          <CodeBlock language="json" title="Response">
            {`{
  "bebedouros": [
    {
      "id": "clx123456789",
      "nome": "Bebedouro Principal", 
      "localizacao": "Entrada do Parque",
      "status": "ATIVO",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "hasMore": false
}`}
          </CodeBlock>
        </div>
      </DocsSection>

      {/* Endpoints Section */}
      <DocsSection
        id="endpoints"
        title="Endpoints"
        description="Lista completa de todos os endpoints disponíveis na API."
      >
        {/* Bebedouros Endpoints */}
        <div id="list-bebedouros">
          <ApiEndpoint
            method="GET"
            path="/bebedouros"
            title="Listar Bebedouros"
            description="Retorna uma lista paginada de bebedouros com filtros opcionais"
            tags={["Bebedouros"]}
            parameters={[
              {
                name: "status",
                type: "string",
                required: false,
                description: "Filtrar por status (ATIVO, INATIVO, MANUTENCAO)",
                example: "ATIVO",
              },
              {
                name: "search",
                type: "string",
                required: false,
                description: "Busca textual por nome, localização ou descrição",
                example: "parque",
              },
              {
                name: "limit",
                type: "number",
                required: false,
                description: "Limite de resultados (1-100)",
                example: "10",
              },
              {
                name: "offset",
                type: "number",
                required: false,
                description: "Deslocamento para paginação",
                example: "0",
              },
            ]}
            responses={{
              "200": {
                description: "Lista de bebedouros retornada com sucesso",
                content: {
                  bebedouros: "Array<Bebedouro>",
                  total: "number",
                  hasMore: "boolean",
                },
              },
            }}
          />
        </div>

        <div id="create-bebedouro">
          <ApiEndpoint
            method="POST"
            path="/bebedouros"
            title="Criar Novo Bebedouro"
            description="Cria um novo bebedouro no sistema"
            tags={["Bebedouros"]}
            security={true}
            requestBody={{
              required: true,
              content: {
                nome: "string (obrigatório)",
                localizacao: "string (obrigatório)",
                descricao: "string (opcional)",
                status: "ATIVO | INATIVO | MANUTENCAO (opcional)",
                latitude: "number (opcional)",
                longitude: "number (opcional)",
              },
            }}
            responses={{
              "201": {
                description: "Bebedouro criado com sucesso",
                content: "Bebedouro object",
              },
              "400": {
                description: "Erro de validação nos dados enviados",
              },
              "401": {
                description: "Token de autenticação não fornecido ou inválido",
              },
            }}
          />
        </div>

        <div id="get-bebedouro">
          <ApiEndpoint
            method="GET"
            path="/bebedouros/{id}"
            title="Buscar Bebedouro por ID"
            description="Retorna os detalhes de um bebedouro específico"
            tags={["Bebedouros"]}
            parameters={[
              {
                name: "id",
                type: "string",
                required: true,
                description: "ID único do bebedouro",
                example: "clx123456789",
              },
            ]}
            responses={{
              "200": {
                description: "Detalhes do bebedouro",
                content: "Bebedouro object",
              },
              "404": {
                description: "Bebedouro não encontrado",
              },
            }}
          />
        </div>

        <div id="update-bebedouro">
          <ApiEndpoint
            method="PUT"
            path="/bebedouros/{id}"
            title="Atualizar Bebedouro"
            description="Atualiza os dados de um bebedouro existente"
            tags={["Bebedouros"]}
            security={true}
            parameters={[
              {
                name: "id",
                type: "string",
                required: true,
                description: "ID único do bebedouro",
                example: "clx123456789",
              },
            ]}
            requestBody={{
              required: true,
              content: {
                nome: "string (opcional)",
                localizacao: "string (opcional)",
                descricao: "string (opcional)",
                status: "ATIVO | INATIVO | MANUTENCAO (opcional)",
                latitude: "number (opcional)",
                longitude: "number (opcional)",
              },
            }}
            responses={{
              "200": {
                description: "Bebedouro atualizado com sucesso",
                content: "Bebedouro object",
              },
              "400": {
                description: "Erro de validação",
              },
              "401": {
                description: "Não autorizado",
              },
              "404": {
                description: "Bebedouro não encontrado",
              },
            }}
          />
        </div>

        <div id="delete-bebedouro">
          <ApiEndpoint
            method="DELETE"
            path="/bebedouros/{id}"
            title="Deletar Bebedouro"
            description="Remove um bebedouro do sistema permanentemente"
            tags={["Bebedouros"]}
            security={true}
            parameters={[
              {
                name: "id",
                type: "string",
                required: true,
                description: "ID único do bebedouro",
                example: "clx123456789",
              },
            ]}
            responses={{
              "200": {
                description: "Bebedouro deletado com sucesso",
                content: {
                  success: "boolean",
                  message: "string",
                },
              },
              "401": {
                description: "Não autorizado",
              },
              "404": {
                description: "Bebedouro não encontrado",
              },
            }}
          />
        </div>

        <div id="bebedouros-stats">
          <ApiEndpoint
            method="GET"
            path="/bebedouros/stats"
            title="Estatísticas dos Bebedouros"
            description="Retorna estatísticas gerais sobre os bebedouros do sistema"
            tags={["Bebedouros"]}
            responses={{
              "200": {
                description: "Estatísticas dos bebedouros",
                content: {
                  total: "number",
                  ativos: "number",
                  inativos: "number",
                  manutencao: "number",
                  criadosUltimos30Dias: "number",
                },
              },
            }}
          />
        </div>

        {/* Posts Demo Endpoint */}
        <div id="posts-hello">
          <ApiEndpoint
            method="GET"
            path="/posts/hello"
            title="Saudação Personalizada (Demo)"
            description="Endpoint de demonstração que retorna uma saudação personalizada"
            tags={["Demo"]}
            parameters={[
              {
                name: "text",
                type: "string",
                required: true,
                description: "Texto para a saudação personalizada",
                example: "mundo",
              },
            ]}
            responses={{
              "200": {
                description: "Saudação personalizada",
                content: {
                  greeting: "string",
                },
              },
              "400": {
                description: "Parâmetro text é obrigatório",
              },
            }}
          />
        </div>
      </DocsSection>

      {/* Status Codes */}
      <DocsSection
        id="status-codes"
        title="Códigos de Status"
        description="Lista dos códigos de status HTTP utilizados pela API."
      >
        <div className="space-y-4">
          <InfoCard
            icon={CheckCircle}
            title="2xx Success"
            description="200 OK - Requisição bem-sucedida | 201 Created - Recurso criado com sucesso"
            variant="success"
          />
          <InfoCard
            icon={AlertTriangle}
            title="4xx Client Error"
            description="400 Bad Request - Erro na requisição | 401 Unauthorized - Não autenticado | 403 Forbidden - Sem permissão | 404 Not Found - Recurso não encontrado"
            variant="warning"
          />
          <InfoCard
            icon={Info}
            title="5xx Server Error"
            description="500 Internal Server Error - Erro interno do servidor"
            variant="destructive"
          />
        </div>
      </DocsSection>
    </DocsLayout>
  );
}
