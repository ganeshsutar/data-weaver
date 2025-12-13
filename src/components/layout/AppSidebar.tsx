import {
  LayoutDashboard,
  LineChart,
  Lightbulb,
  Database,
  Users,
  Library,
  FileText,
  Bot,
  MoreHorizontal,
  Settings,
  HelpCircle,
  Search,
  Plus,
  Mail,
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const mainNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, isActive: true },
  { title: "Analyses", icon: LineChart },
  { title: "Insights", icon: Lightbulb },
  { title: "Datasets", icon: Database },
  { title: "Team", icon: Users },
]

const documentItems = [
  { title: "Data Library", icon: Library },
  { title: "Reports", icon: FileText },
  { title: "Assistant", icon: Bot },
  { title: "More", icon: MoreHorizontal },
]

const bottomItems = [
  { title: "Settings", icon: Settings },
  { title: "Help", icon: HelpCircle },
  { title: "Search", icon: Search },
]

interface AppSidebarProps {
  user?: {
    username?: string
    email?: string
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="h-4 w-4" />
          </div>
          <span className="font-semibold">Data Weaver</span>
        </div>
        <div className="flex gap-2 px-2">
          <Button variant="secondary" className="flex-1 justify-start gap-2">
            <Plus className="h-4 w-4" />
            New Analysis
          </Button>
          <Button variant="secondary" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {documentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{user?.username || "User"}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || "user@example.com"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
