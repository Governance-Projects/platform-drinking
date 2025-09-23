import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center">
        <h1 className="mb-8 text-4xl font-bold text-slate-900 dark:text-slate-100">
          Drinking App
        </h1>

        <Link href="/bebedouros">
          <Button size="lg" className="px-8 py-4 text-lg">
            Acessar Bebedouros
          </Button>
        </Link>
      </div>
    </div>
  );
}
