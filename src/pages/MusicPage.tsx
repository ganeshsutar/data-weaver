import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useMoodData } from "@/hooks/useMoodData"
import { useYearlyData } from "@/hooks/useYearlyData"
import { AudioFeaturesChart } from "@/components/charts/AudioFeaturesChart"
import { EnergyValenceQuadrant } from "@/components/charts/EnergyValenceQuadrant"
import { TempoTrendChart } from "@/components/charts/TempoTrendChart"
import { ArtistDiversityChart } from "@/components/charts/ArtistDiversityChart"

export function MusicPage() {
  const { data: moodData, loading: moodLoading } = useMoodData()
  const { data: yearlyData, loading: yearlyLoading } = useYearlyData()

  const loading = moodLoading || yearlyLoading

  return (
    <SidebarInset>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/50 backdrop-blur-lg">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Music Insights</h1>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-6">
          {/* Audio features multi-line chart */}
          <AudioFeaturesChart data={moodData} loading={loading} />

          {/* Energy vs Valence quadrant + Tempo trend */}
          <div className="grid gap-4 lg:grid-cols-2">
            <EnergyValenceQuadrant data={moodData} loading={loading} />
            <TempoTrendChart data={yearlyData} loading={loading} />
          </div>

          {/* Artist diversity */}
          <ArtistDiversityChart data={moodData} loading={loading} />
        </div>
      </main>
    </SidebarInset>
  )
}
