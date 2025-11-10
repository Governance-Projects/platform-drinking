import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "~/server/auth/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso às rotas de API de autenticação e outras rotas públicas
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/trpc") ||
    pathname.startsWith("/api/openapi.json") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/login" ||
    pathname === "/" ||
    pathname.startsWith("/api-docs")
  ) {
    return NextResponse.next();
  }

  // Proteger todas as rotas que começam com /app
  if (pathname.includes("/app")) {
    try {
      // Verificar se o usuário está autenticado
      const sessionResponse = await auth.api.getSession({
        headers: request.headers,
      });

      const session = sessionResponse?.session;

      // Se não houver sessão, redirecionar para login
      if (!session) {
        const loginUrl = new URL("/login", request.url);
        // Adicionar o pathname original como query param para redirecionar após login
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Usuário autenticado, permitir acesso
      return NextResponse.next();
    } catch (error) {
      // Em caso de erro, redirecionar para login
      console.error("Middleware auth error:", error);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Para outras rotas, permitir acesso
  return NextResponse.next();
}

// Configurar quais rotas o middleware deve executar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
