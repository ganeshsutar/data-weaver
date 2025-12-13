import { useParams } from "react-router-dom"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Sample analysis data
const sampleAnalyses: Record<
  string,
  { title: string; description: string; content: string }
> = {
  "sample-sales-analysis": {
    title: "Q4 Sales Performance Analysis",
    description:
      "Analysis of quarterly sales data combined with customer demographics",
    content:
      "This sample analysis demonstrates how Data Weaver combines sales transaction data with customer demographic information to reveal purchasing patterns across different age groups and regions. Key findings include a 23% increase in online sales among 25-34 year olds and strong correlation between regional marketing spend and conversion rates.",
  },
  "sample-inventory-analysis": {
    title: "Inventory Optimization Report",
    description: "Combined inventory levels with supplier lead times",
    content:
      "This sample shows correlation analysis between inventory turnover rates and supplier delivery performance, identifying opportunities for stock level optimization. The analysis revealed that reducing safety stock by 15% for high-velocity items could free up $2.3M in working capital without impacting service levels.",
  },
}

export function AnalysisPage() {
  const { analysisId } = useParams<{ analysisId: string }>()

  const analysis = analysisId ? sampleAnalyses[analysisId] : null
  const isKnownSample = analysis !== null

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1 text-foreground hover:text-foreground hover:bg-muted" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">
          {isKnownSample ? analysis.title : `Analysis: ${analysisId}`}
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {isKnownSample ? (
            <Card>
              <CardHeader>
                <CardTitle>{analysis.title}</CardTitle>
                <CardDescription>{analysis.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{analysis.content}</p>
                <div className="mt-6 rounded-lg bg-muted p-4">
                  <p className="text-sm italic text-muted-foreground">
                    This is sample/placeholder content. In the full
                    implementation, this page will display interactive charts,
                    data tables, and AI-generated insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
                <CardDescription>Analysis ID: {analysisId}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This is a placeholder page for analysis "{analysisId}". In the
                  full implementation, this will display the analysis results
                  loaded from the database.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </SidebarInset>
  )
}
