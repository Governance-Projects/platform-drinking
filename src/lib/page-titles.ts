/**
 * Mapeamento de rotas para títulos do header
 * Adicione novas rotas aqui conforme necessário
 */
export const pageTitles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/bebedouros": "Bebedouros",
  "/app/bebedouros/novo": "Novo Bebedouro",
  // Adicione mais rotas conforme necessário
};

/**
 * Função para obter o título da página baseado na rota
 * Suporta rotas dinâmicas (ex: /app/bebedouros/[id])
 */
export function getPageTitle(pathname: string): string {
  // Tenta encontrar uma correspondência exata
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  // Para rotas dinâmicas, tenta encontrar um padrão
  // Ex: /app/bebedouros/123 -> /app/bebedouros
  const pathSegments = pathname.split("/").filter(Boolean);

  // Tenta encontrar o título do caminho pai
  for (let i = pathSegments.length; i > 0; i--) {
    const parentPath = "/" + pathSegments.slice(0, i).join("/");
    if (pageTitles[parentPath]) {
      return pageTitles[parentPath];
    }
  }

  // Fallback: retorna o título padrão ou o último segmento da rota
  return "Bebedouros";
}
