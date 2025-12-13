import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  description: string
  subtext: string
}

function StatCard({ title, value, change, changeType, description, subtext }: StatCardProps) {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className={`flex items-center gap-1 text-xs ${
            changeType === "positive" ? "text-emerald-500" : "text-red-500"
          }`}>
            {changeType === "positive" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change}
          </div>
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold">{value}</span>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-sm text-muted-foreground">{description}</span>
          {changeType === "positive" ? (
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
          ) : (
            <TrendingDown className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">{subtext}</span>
      </CardContent>
    </Card>
  )
}

const statsData: StatCardProps[] = [
  {
    title: "Total Analyses",
    value: "128",
    change: "+12.5%",
    changeType: "positive",
    description: "Trending up this month",
    subtext: "Analyses for the last 6 months",
  },
  {
    title: "Datasets Processed",
    value: "1,234",
    change: "+8%",
    changeType: "positive",
    description: "Up 8% this period",
    subtext: "Strong data processing rate",
  },
  {
    title: "Insights Generated",
    value: "45,678",
    change: "+15%",
    changeType: "positive",
    description: "High insight generation",
    subtext: "Exceeds monthly targets",
  },
  {
    title: "Accuracy Rate",
    value: "94.5%",
    change: "+2.3%",
    changeType: "positive",
    description: "Steady improvement",
    subtext: "Meets quality benchmarks",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
