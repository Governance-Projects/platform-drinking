import type { ReactNode } from "react";
import { PublicHeader } from "~/components/shell/public/app-header";
import { SidebarInset } from "~/components/ui/sidebar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarInset>
      <PublicHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          {children}
        </div>
      </div>
    </SidebarInset>
  );
}
