import { useLocation, Link } from "react-router-dom"
import {
  Database,
  FileText,
  Settings,
  HelpCircle,
  Plus,
  Sun,
  Moon,
  LogOut,
  Beaker,
  Clock,
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
import { useTheme } from "@/components/ThemeProvider"

// Sample analyses data
const sampleAnalyses = [
  {
    id: "sample-sales-analysis",
    title: "Q4 Sales Performance",
    icon: FileText,
  },
  {
    id: "sample-inventory-analysis",
    title: "Inventory Optimization",
    icon: FileText,
  },
]

// Previous analyses - placeholder data (will be fetched from API later)
const previousAnalyses = [
  { id: "analysis-001", title: "Customer Segmentation", date: "Dec 10" },
  { id: "analysis-002", title: "Revenue Trends", date: "Dec 8" },
  { id: "analysis-003", title: "Product Performance", date: "Dec 5" },
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
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-4 px-2 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Database className="h-4 w-4" />
            </div>
            <span className="font-semibold">Data Weaver</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Application that mashes up two unrelated data sources to show something interesting
          </span>
        </div>
        <div className="px-2">
          <Button variant="secondary" className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            New Analysis
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Sample Analyses Section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Beaker className="mr-2 h-4 w-4" />
            Sample Analyses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sampleAnalyses.map((analysis) => (
                <SidebarMenuItem key={analysis.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === `/${analysis.id}`}
                    tooltip={analysis.title}
                  >
                    <Link to={`/${analysis.id}`}>
                      <analysis.icon className="h-4 w-4" />
                      <span>{analysis.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Previous Analyses Section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Clock className="mr-2 h-4 w-4" />
            Previous Analyses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {previousAnalyses.map((analysis) => (
                <SidebarMenuItem key={analysis.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === `/${analysis.id}`}
                    tooltip={`${analysis.title} - ${analysis.date}`}
                  >
                    <Link to={`/${analysis.id}`}>
                      <FileText className="h-4 w-4" />
                      <span>{analysis.title}</span>
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
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Light theme"
              isActive={theme === "light"}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Dark theme"
              isActive={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
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
