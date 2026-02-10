"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiHome4Line,
  RiShieldCheckLine,
  RiSearchLine,
  RiFileEditLine,
  RiLogoutBoxRLine,
  RiListCheck3,
  RiCheckDoubleLine,
} from "@remixicon/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Home",
    href: "/demo",
    icon: RiHome4Line,
  },
  {
    title: "Schadensdarstellung schreiben",
    href: "/demo/schadensdarstellung-schreiben",
    icon: RiFileEditLine,
  },
  {
    title: "Gutachten suchen",
    href: "/demo/gutachten-suchen",
    icon: RiSearchLine,
  },
];

const qmSubItems = [
  {
    title: "Regeln",
    href: "/demo/qualitaetsmanagement/regeln",
    icon: RiListCheck3,
  },
  {
    title: "Pr\u00fcfung",
    href: "/demo/qualitaetsmanagement/pruefung",
    icon: RiCheckDoubleLine,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const isQmActive = pathname.startsWith("/demo/qualitaetsmanagement");

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Qualit\u00e4tsmanagement with sub-items */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isQmActive}
                >
                  <RiShieldCheckLine />
                  <span>{"Qualit\u00e4tsmanagement"}</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {qmSubItems.map((sub) => (
                    <SidebarMenuSubItem key={sub.href}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === sub.href}
                      >
                        <Link href={sub.href}>
                          <sub.icon />
                          <span>{sub.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <RiLogoutBoxRLine />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
