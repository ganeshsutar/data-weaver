import { useState, useEffect, useCallback } from "react"
import { client, type DashboardMetadata } from "@/lib/amplify-client"

type MetadataType = "date_range" | "correlation_matrix" | "decade_summary"

interface UseDashboardMetadataOptions {
  metadataType: MetadataType
}

interface MetadataResult {
  data: DashboardMetadata | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useDashboardMetadata(options: UseDashboardMetadataOptions): MetadataResult {
  const [data, setData] = useState<DashboardMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await client.models.DashboardMetadata.get({
        metadataType: options.metadataType,
      })

      setData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch dashboard metadata"))
    } finally {
      setLoading(false)
    }
  }, [options.metadataType])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
