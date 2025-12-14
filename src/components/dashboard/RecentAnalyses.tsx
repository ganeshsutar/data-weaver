import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface Analysis {
  id: string
  name: string
  datasetType: string
  status: "In Progress" | "Completed" | "Archived"
  insights: number
  limit: number
  owner: string
}

const allAnalyses: Analysis[] = [
  {
    id: "1",
    name: "Customer Segmentation",
    datasetType: "CSV Import",
    status: "In Progress",
    insights: 18,
    limit: 5,
    owner: "John Doe",
  },
  {
    id: "2",
    name: "Sales Trends Q4",
    datasetType: "Database Query",
    status: "Completed",
    insights: 29,
    limit: 24,
    owner: "Jane Smith",
  },
  {
    id: "3",
    name: "User Behavior Analysis",
    datasetType: "API Integration",
    status: "In Progress",
    insights: 12,
    limit: 10,
    owner: "Bob Wilson",
  },
  {
    id: "4",
    name: "Revenue Forecast",
    datasetType: "CSV Import",
    status: "Completed",
    insights: 35,
    limit: 30,
    owner: "Alice Brown",
  },
  {
    id: "5",
    name: "Marketing Campaign ROI",
    datasetType: "Database Query",
    status: "Archived",
    insights: 22,
    limit: 20,
    owner: "Charlie Davis",
  },
]

function getStatusBadge(status: Analysis["status"]) {
  switch (status) {
    case "In Progress":
      return <Badge variant="outline" className="text-yellow-500 border-yellow-500">In Progress</Badge>
    case "Completed":
      return <Badge variant="outline" className="text-green-500 border-green-500">Completed</Badge>
    case "Archived":
      return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>
  }
}

function AnalysisTable({ analyses }: { analyses: Analysis[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Dataset Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Insights</TableHead>
          <TableHead>Limit</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {analyses.map((analysis) => (
          <TableRow key={analysis.id}>
            <TableCell className="font-medium">{analysis.name}</TableCell>
            <TableCell className="text-muted-foreground">{analysis.datasetType}</TableCell>
            <TableCell>{getStatusBadge(analysis.status)}</TableCell>
            <TableCell>{analysis.insights}</TableCell>
            <TableCell>{analysis.limit}</TableCell>
            <TableCell>{analysis.owner}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function RecentAnalyses() {
  const inProgressAnalyses = allAnalyses.filter((a) => a.status === "In Progress")
  const completedAnalyses = allAnalyses.filter((a) => a.status === "Completed")
  const archivedAnalyses = allAnalyses.filter((a) => a.status === "Archived")

  return (
    <Card>
      <CardHeader className="pb-0">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                All Analyses
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress
                <Badge variant="secondary" className="ml-2">
                  {inProgressAnalyses.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
                <Badge variant="secondary" className="ml-2">
                  {completedAnalyses.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archived
              </TabsTrigger>
            </TabsList>
          </div>
          <CardContent className="pt-4 px-0">
            <TabsContent value="all" className="mt-0">
              <AnalysisTable analyses={allAnalyses} />
            </TabsContent>
            <TabsContent value="in-progress" className="mt-0">
              <AnalysisTable analyses={inProgressAnalyses} />
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              <AnalysisTable analyses={completedAnalyses} />
            </TabsContent>
            <TabsContent value="archived" className="mt-0">
              <AnalysisTable analyses={archivedAnalyses} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </CardHeader>
    </Card>
  )
}
