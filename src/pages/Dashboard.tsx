import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart"
import { RecentAnalyses } from "@/components/dashboard/RecentAnalyses"

export function Dashboard() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <StatsCards />
          <AnalyticsChart />
          <RecentAnalyses />
        </div>
      </main>
    </SidebarInset>
  )
}
