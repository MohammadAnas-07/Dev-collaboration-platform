"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { ModeToggle } from "@/components/mode-toggle";

// This is sample data.
const data = {
  user: {
    name: "Developer",
    email: "dev@forge.com",
    avatar: "https://github.com/shadcn.png",
  },
  teams: [
    {
      name: "Forge Inc",
      logo: Bot,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Repositories",
      url: "/repositories",
      icon: BookOpen,
    },
    {
      title: "Collaborators",
      url: "/collaborators",
      icon: Users,
    },
    {
      title: "Billing",
      url: "/settings/billing",
      icon: CreditCard,
    },
    {
      title: "AI Dashboard",
      url: "/ai",
      icon: Bot,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <TeamSwitcher teams={data.teams} />
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <a href={item.url} className="flex items-center gap-2 w-full">
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
