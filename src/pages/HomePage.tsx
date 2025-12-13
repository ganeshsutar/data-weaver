import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function HomePage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1 text-foreground hover:text-foreground hover:bg-muted" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Home</h1>
      </header>
      <main className="flex-1 overflow-auto p-6">
        {/* Blank content area */}
      </main>
    </SidebarInset>
  )
}
