"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Search,
  LayoutGrid,
  FolderOpen,
  Hexagon,
  Bell,
  Sun,
  Moon,
  ChartPieIcon,
  PlusCircle,
  MoreHorizontal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import EmptyState from "./empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser } from "@/modules/user/hook";
import Image from "next/image";
import { useRouter } from "next/navigation";

const chats = [
  "Find a good sci-fi movie ton...",
  "Ideas for a mobile app name",
  "Explain stock market trends",
  "Design feedback for portfol...",
  "Creative tagline ideas for fi...",
  "Find animated movies with...",
  "Suggest movies based on t...",
];

export function AppSidebar() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center overflow-hidden">
              {mounted && user?.image ? (
                <Image
                  src={user.image}
                  alt="User"
                  height={32}
                  width={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {mounted && user?.name
                    ? user.name.slice(0, 1).toUpperCase()
                    : "E"}
                </span>
              )}
            </div>
            <span className="font-semibold text-foreground">
              {mounted && user?.name ? `${user.name}'s AI` : "Elysium AI"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div className="p-2">
          <button className="w-full py-2 px-4 rounded-2xl bg-[#a3ff91] hover:bg-[#8ee87e] text-black font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer">
            <PlusCircle className="w-5 h-5 text-[#43b22d] font-bold rounded-full p-0.5" />
            <span>New Chat</span>
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Explore"
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Search />
                  <span>Explore</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Categories"
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <LayoutGrid />
                  <span>Categories</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Library"
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <FolderOpen />
                  <span>Library</span>
                  <SidebarMenuBadge className="bg-zinc-800 text-[#a3ff91]">
                    141
                  </SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Settings"
                  onClick={() => router.push("/setting")}
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Hexagon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 ? (
                <EmptyState
                  title="No Chats"
                  description="Start a new chat or create a new category to get started."
                  icon={<ChartPieIcon size={50} />}
                />
              ) : (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat}>
                    <SidebarMenuButton className="">
                      <span>{chat}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={(triggerProps: any) => (
                          <SidebarMenuAction {...triggerProps} showOnHover>
                            <MoreHorizontal />
                          </SidebarMenuAction>
                        )}
                      />
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#a3ff91] p-0.5">
              <Image
                src="https://picsum.photos/seed/elysium/100/100"
                alt="Profile"
                height={100}
                width={100}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors p-2 rounded-md">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors p-2 rounded-md"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )
              ) : (
                <Sun className="w-5 h-5 opacity-0" />
              )}
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
