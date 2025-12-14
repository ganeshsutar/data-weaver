import { useState, useEffect, useCallback } from "react"
import {
  type ThemeConfig,
  type ThemeMode,
  type ThemeStyle,
  type ThemeColor,
  type BaseColor,
  type ThemeRadius,
  type ThemeFont,
  defaultThemeConfig,
  THEME_STORAGE_KEY,
  radiusMeta,
  fontMeta,
} from "@/lib/theme-config"
import { themeColors, baseColors, destructiveColors } from "@/lib/theme-colors"
import { getStyleCSSVariables } from "@/lib/theme-styles"

// Load Google Font dynamically
function loadGoogleFont(fontKey: ThemeFont): void {
  const fontInfo = fontMeta[fontKey]
  const linkId = `google-font-${fontKey}`

  // Check if already loaded
  if (document.getElementById(linkId)) {
    return
  }

  const link = document.createElement("link")
  link.id = linkId
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?family=${fontInfo.googleFont}&display=swap`
  document.head.appendChild(link)
}

// Apply CSS variables to document root
function applyCSSVariables(config: ThemeConfig): void {
  const root = document.documentElement
  const mode = config.mode

  // Get color palettes
  const themePalette = themeColors[config.themeColor][mode]
  const basePalette = baseColors[config.baseColor][mode]
  const destructive = destructiveColors[mode]

  // Apply theme colors (primary/accent)
  root.style.setProperty("--primary", themePalette.primary)
  root.style.setProperty("--primary-foreground", themePalette.primaryForeground)
  root.style.setProperty("--ring", themePalette.ring)
  root.style.setProperty("--chart-1", themePalette.chart1)
  root.style.setProperty("--chart-2", themePalette.chart2)
  root.style.setProperty("--chart-3", themePalette.chart3)
  root.style.setProperty("--chart-4", themePalette.chart4)
  root.style.setProperty("--chart-5", themePalette.chart5)

  // Apply base colors (gray scale)
  root.style.setProperty("--background", basePalette.background)
  root.style.setProperty("--foreground", basePalette.foreground)
  root.style.setProperty("--card", basePalette.card)
  root.style.setProperty("--card-foreground", basePalette.cardForeground)
  root.style.setProperty("--popover", basePalette.popover)
  root.style.setProperty("--popover-foreground", basePalette.popoverForeground)
  root.style.setProperty("--secondary", basePalette.secondary)
  root.style.setProperty("--secondary-foreground", basePalette.secondaryForeground)
  root.style.setProperty("--muted", basePalette.muted)
  root.style.setProperty("--muted-foreground", basePalette.mutedForeground)
  root.style.setProperty("--accent", basePalette.accent)
  root.style.setProperty("--accent-foreground", basePalette.accentForeground)
  root.style.setProperty("--border", basePalette.border)
  root.style.setProperty("--input", basePalette.input)

  // Sidebar colors
  root.style.setProperty("--sidebar-background", basePalette.sidebarBackground)
  root.style.setProperty("--sidebar-foreground", basePalette.sidebarForeground)
  root.style.setProperty("--sidebar-primary", basePalette.sidebarPrimary)
  root.style.setProperty("--sidebar-primary-foreground", basePalette.sidebarPrimaryForeground)
  root.style.setProperty("--sidebar-accent", basePalette.sidebarAccent)
  root.style.setProperty("--sidebar-accent-foreground", basePalette.sidebarAccentForeground)
  root.style.setProperty("--sidebar-border", basePalette.sidebarBorder)
  root.style.setProperty("--sidebar-ring", basePalette.sidebarRing)

  // Destructive colors
  root.style.setProperty("--destructive", destructive.destructive)
  root.style.setProperty("--destructive-foreground", destructive.destructiveForeground)

  // Apply style variables first (includes radius multiplier)
  const styleVars = getStyleCSSVariables(config.style)
  Object.entries(styleVars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // Apply radius (accounting for style's radius multiplier)
  const baseRadiusValue = radiusMeta[config.radius].value
  const radiusMultiplier = parseFloat(styleVars["--radius-multiplier"])

  // Calculate final radius: base * multiplier
  // For Lyra (multiplier: 0), this results in "0rem"
  let finalRadius: string
  if (radiusMultiplier === 0) {
    finalRadius = "0"
  } else {
    const baseRadiusNum = parseFloat(baseRadiusValue)
    if (isNaN(baseRadiusNum)) {
      finalRadius = baseRadiusValue
    } else {
      finalRadius = `${baseRadiusNum * radiusMultiplier}rem`
    }
  }

  root.style.setProperty("--radius", finalRadius)

  // Apply font
  const fontInfo = fontMeta[config.font]
  root.style.setProperty("--font-family", fontInfo.family)
  document.body.style.fontFamily = fontInfo.family
}

// Apply dark/light mode class
function applyModeClass(mode: ThemeMode): void {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(mode)
}

// Load config from localStorage
function loadConfig(): ThemeConfig {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultThemeConfig, ...parsed }
    }
  } catch (e) {
    console.warn("Failed to load theme config from localStorage:", e)
  }
  return defaultThemeConfig
}

// Save config to localStorage
function saveConfig(config: ThemeConfig): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config))
  } catch (e) {
    console.warn("Failed to save theme config to localStorage:", e)
  }
}

export interface UseThemeConfigReturn {
  config: ThemeConfig
  setMode: (mode: ThemeMode) => void
  setStyle: (style: ThemeStyle) => void
  setThemeColor: (color: ThemeColor) => void
  setBaseColor: (color: BaseColor) => void
  setRadius: (radius: ThemeRadius) => void
  setFont: (font: ThemeFont) => void
  resetConfig: () => void
}

export function useThemeConfig(): UseThemeConfigReturn {
  const [config, setConfig] = useState<ThemeConfig>(loadConfig)

  // Apply theme on mount and config changes
  useEffect(() => {
    applyModeClass(config.mode)
    applyCSSVariables(config)
    loadGoogleFont(config.font)
    saveConfig(config)
  }, [config])

  const setMode = useCallback((mode: ThemeMode) => {
    setConfig((prev) => ({ ...prev, mode }))
  }, [])

  const setStyle = useCallback((style: ThemeStyle) => {
    setConfig((prev) => ({ ...prev, style }))
  }, [])

  const setThemeColor = useCallback((themeColor: ThemeColor) => {
    setConfig((prev) => ({ ...prev, themeColor }))
  }, [])

  const setBaseColor = useCallback((baseColor: BaseColor) => {
    setConfig((prev) => ({ ...prev, baseColor }))
  }, [])

  const setRadius = useCallback((radius: ThemeRadius) => {
    setConfig((prev) => ({ ...prev, radius }))
  }, [])

  const setFont = useCallback((font: ThemeFont) => {
    setConfig((prev) => ({ ...prev, font }))
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(defaultThemeConfig)
  }, [])

  return {
    config,
    setMode,
    setStyle,
    setThemeColor,
    setBaseColor,
    setRadius,
    setFont,
    resetConfig,
  }
}
