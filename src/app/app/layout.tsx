import { AppSidebar } from "~/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <div className="flex w-full flex-1 flex-col p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
