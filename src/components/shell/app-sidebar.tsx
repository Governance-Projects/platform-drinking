import { Home, Inbox } from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/app",
    icon: Home,
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
    </Sidebar>
  );
}
