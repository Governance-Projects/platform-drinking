"use client";

import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Play,
  Lock,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface ApiEndpointProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  title: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  requestBody?: {
    required: boolean;
    content: Record<string, unknown>;
  };
  responses: Record<
    string,
    {
      description: string;
      content?: Record<string, unknown> | string;
    }
  >;
  security?: boolean;
  tags?: string[];
}

const methodColors = {
  GET: "bg-green-500 hover:bg-green-600",
  POST: "bg-blue-500 hover:bg-blue-600",
  PUT: "bg-orange-500 hover:bg-orange-600",
  DELETE: "bg-red-500 hover:bg-red-600",
  PATCH: "bg-purple-500 hover:bg-purple-600",
};

const methodBadgeColors = {
  GET: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  POST: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  PUT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  PATCH:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
};

export function ApiEndpoint({
  method,
  path,
  title,
  description,
  parameters = [],
  requestBody,
  responses,
  security = false,
  tags = [],
}: ApiEndpointProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCurlExample = () => {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://drinking-app.vercel.app/api"
        : "http://localhost:3001/api";

    let curl = `curl -X ${method} "${baseUrl}${path}"`;

    if (security) {
      curl += ` \\\n  -H "Authorization: Bearer YOUR_JWT_TOKEN"`;
    }

    if (requestBody && method !== "GET") {
      curl += ` \\\n  -H "Content-Type: application/json"`;
      curl += ` \\\n  -d '${JSON.stringify(requestBody.content, null, 2)}'`;
    }

    return curl;
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader
        className="hover:bg-muted/50 cursor-pointer p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge
              className={cn(
                "font-mono text-xs font-semibold",
                methodBadgeColors[method],
              )}
            >
              {method}
            </Badge>
            <code className="bg-muted rounded px-2 py-1 font-mono text-sm">
              {path}
            </code>
            {security && <Lock className="text-muted-foreground h-4 w-4" />}
          </div>
          <div className="flex items-center space-x-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="parameters">Parâmetros</TabsTrigger>
              <TabsTrigger value="responses">Respostas</TabsTrigger>
              <TabsTrigger value="examples">Exemplos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 p-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold">Endpoint</h4>
                <div className="bg-muted flex items-center space-x-2 rounded-md p-3">
                  <Badge className={methodBadgeColors[method]}>{method}</Badge>
                  <code className="flex-1 text-sm">{path}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(path)}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {security && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Autenticação Requerida
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Este endpoint requer um token JWT válido no header
                    Authorization.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="parameters" className="p-6">
              {parameters.length > 0 ? (
                <div className="space-y-4">
                  {parameters.map((param) => (
                    <div
                      key={param.name}
                      className="border-l-4 border-blue-200 pl-4 dark:border-blue-800"
                    >
                      <div className="mb-2 flex items-center space-x-2">
                        <code className="text-sm font-semibold">
                          {param.name}
                        </code>
                        <Badge
                          variant={param.required ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {param.required ? "obrigatório" : "opcional"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {param.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-1 text-sm">
                        {param.description}
                      </p>
                      {param.example && (
                        <code className="bg-muted rounded px-2 py-1 text-xs">
                          Exemplo: {param.example}
                        </code>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhum parâmetro requerido.
                </p>
              )}
            </TabsContent>

            <TabsContent value="responses" className="p-6">
              <div className="space-y-4">
                {Object.entries(responses).map(([status, response]) => (
                  <div key={status} className="rounded-md border">
                    <div className="bg-muted/50 flex items-center space-x-2 p-3">
                      <Badge
                        className={cn(
                          "text-xs",
                          status.startsWith("2")
                            ? "bg-green-100 text-green-800"
                            : status.startsWith("4")
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {status}
                      </Badge>
                      <span className="text-sm font-medium">
                        {response.description}
                      </span>
                    </div>
                    {response.content && (
                      <div className="p-3">
                        <pre className="bg-muted overflow-x-auto rounded p-3 text-xs">
                          <code>
                            {typeof response.content === "string"
                              ? response.content
                              : JSON.stringify(response.content, null, 2)}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4 p-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold">Exemplo cURL</h4>
                <div className="relative">
                  <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
                    <code>{generateCurlExample()}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(generateCurlExample())}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">Testar Endpoint</h4>
                <Button className={cn("text-white", methodColors[method])}>
                  <Play className="mr-2 h-4 w-4" />
                  Executar {method}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
