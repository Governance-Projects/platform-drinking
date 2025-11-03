"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { getPageTitle } from "~/lib/page-titles";

export function AppHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="bg-main flex h-(--header-height) shrink-0 items-center gap-2 border-b py-8 text-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="lg: flex w-full items-center gap-1 px-4 py-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="hover:border-accent flex hover:cursor-pointer hover:border hover:bg-transparent sm:flex"
          >
            <Image src="/logo.png" alt="logo" width={150} height={100} />
          </Button>
        </div>
      </div>
    </header>
  );
}
