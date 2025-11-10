"use client";

import { User, LogOut, UserCircle, Settings } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useSession, signOut } from "~/server/auth/client";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "next/navigation";

export function SessionCard() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card className="bg-white/40 hover:cursor-pointer hover:bg-white/60">
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                <User className="text-primary h-5 w-5" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <p className="text-foreground truncate text-sm font-bold">
                  {session?.user?.name ?? "Usuário"}
                </p>
                <p className="truncate text-xs text-black/60">
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverTrigger>

      <PopoverContent side="right" className="w-80">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full">
                <User className="text-primary h-6 w-6" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <p className="text-foreground truncate text-sm font-bold">
                  {session?.user?.name ?? "Usuário"}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/app/perfil")}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Atualizar Informações
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/app/configuracoes")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>

            <Separator />

            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
