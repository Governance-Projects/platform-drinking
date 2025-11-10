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
import { SessionCard } from "./sidebar/session-card";

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
        <SessionCard />
      </SidebarFooter>
    </Sidebar>
  );
}
