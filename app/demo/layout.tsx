import Image from "next/image";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-end px-6">
          <div className="flex items-center gap-2.5 rounded-full bg-muted py-1.5 pl-2 pr-4">
            <Image
              src="/aron-profile.png"
              alt="Aron Scheffczyk"
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
            <span className="text-sm font-medium">Aron Scheffczyk</span>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
