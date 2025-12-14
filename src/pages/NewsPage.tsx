import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useMoodData } from "@/hooks/useMoodData"
import { NewsCategoryChart } from "@/components/charts/NewsCategoryChart"
import { NewsSentimentChart } from "@/components/charts/NewsSentimentChart"
import { CategoryPieChart } from "@/components/charts/CategoryPieChart"
import { NewsVolumeChart } from "@/components/charts/NewsVolumeChart"
import { Button } from "@/components/ui/button"

export function NewsPage() {
  const { data: moodData, loading } = useMoodData()
  const [viewMode, setViewMode] = useState<"absolute" | "percentage">("absolute")

  return (
    <SidebarInset>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/50 backdrop-blur-lg">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold">News Analysis</h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "absolute" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("absolute")}
            >
              Absolute
            </Button>
            <Button
              variant={viewMode === "percentage" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("percentage")}
            >
              Percentage
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-6">
          {/* News category stacked area */}
          <NewsCategoryChart data={moodData} loading={loading} viewMode={viewMode} />

          {/* Sentiment + Category pie */}
          <div className="grid gap-4 lg:grid-cols-2">
            <NewsSentimentChart data={moodData} loading={loading} />
            <CategoryPieChart data={moodData} loading={loading} />
          </div>

          {/* News volume timeline */}
          <NewsVolumeChart data={moodData} loading={loading} />
        </div>
      </main>
    </SidebarInset>
  )
}
