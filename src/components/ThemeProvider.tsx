import { createContext } from "react"
import { useThemeConfig, type UseThemeConfigReturn } from "@/hooks/useThemeConfig"

type ThemeProviderProps = {
  children: React.ReactNode
}

export const ThemeProviderContext = createContext<UseThemeConfigReturn | undefined>(undefined)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const themeConfig = useThemeConfig()

  return (
    <ThemeProviderContext.Provider {...props} value={themeConfig}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
