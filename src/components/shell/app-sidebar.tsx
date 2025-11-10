"use client";

import { ChartColumnDecreasing, Inbox, LogOut, User } from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Card, CardContent } from "~/components/ui/card";
import { useSession, signOut } from "~/server/auth/client";

const items = [
  {
    title: "Dashboard",
    url: "/app",
    icon: ChartColumnDecreasing,
  },
  {
    title: "Bebedouros",
    url: "/app/bebedouros",
    icon: Inbox,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar className="text-white">
      <SidebarHeader>
        <div className="flex items-center justify-center">
          <Image src="/logo.png" alt="logo" width={200} height={100} />
        </div>
        <h1 className="text-main text-2xl font-bold">Bebedouros</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => signOut()}
            className="flex flex-row items-center justify-start"
          >
            Sair <LogOut />
          </SidebarMenuButton>
        </SidebarMenuItem>
        <Card className="border-border/40 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                <User className="text-primary h-5 w-5" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <p className="text-foreground truncate text-sm font-medium">
                  {session?.user?.name ?? "Usuário"}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
