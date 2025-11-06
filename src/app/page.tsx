import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center">
        <h1 className="mb-8 text-4xl font-bold text-slate-900 dark:text-slate-100">
          Drinking App
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/login">
            <Button size="lg" className="px-8 py-4 text-lg">
              Fazer Login
            </Button>
          </Link>
          <Link href="/app/bebedouros">
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              Acessar Bebedouros
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
