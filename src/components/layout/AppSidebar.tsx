import { useLocation, Link } from "react-router-dom"
import {
  Database,
  Settings,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Music,
  Newspaper,
  Calendar,
} from "lucide-react"

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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeMenu } from "@/components/theme/ThemeMenu"

// Dashboard navigation items
const dashboardItems = [
  { title: "Overview", icon: LayoutDashboard, path: "/" },
  { title: "Music Insights", icon: Music, path: "/music" },
  { title: "News Analysis", icon: Newspaper, path: "/news" },
  { title: "Events", icon: Calendar, path: "/events" },
]

const bottomItems = [
  { title: "Settings", icon: Settings },
  { title: "Help", icon: HelpCircle },
]

interface AppSidebarProps {
  user?: {
    username?: string
    email?: string
  }
  onSignOut?: () => void
}

export function AppSidebar({ user, onSignOut }: AppSidebarProps) {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-4 px-2 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Database className="h-4 w-4" />
            </div>
            <span className="font-semibold">Cultural Pulse</span>
          </div>
          <span className="text-xs text-muted-foreground leading-relaxed">
            Analyzing America's mood through 67 years of Billboard Hot 100 charts,
            Spotify audio features like valence and energy,
            and HuffPost news sentiment from 1958-2025.
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeMenu
              asChild
              trigger={
                <SidebarMenuButton tooltip="Appearance settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
          {bottomItems.slice(1).map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback>
              {user?.email?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
            <span className="truncate text-sm">
              {user?.email || "user@example.com"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onSignOut}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
