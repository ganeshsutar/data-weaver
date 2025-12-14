// Theme configuration types and defaults

export type ThemeMode = "light" | "dark"

export type ThemeStyle = "vega" | "nova" | "mala" | "lyra" | "mira"

export type ThemeColor =
  | "neutral"
  | "amber"
  | "blue"
  | "cyan"
  | "emerald"
  | "fuchsia"
  | "green"
  | "indigo"
  | "lime"
  | "orange"
  | "pink"

export type BaseColor = "neutral" | "stone" | "zinc" | "gray"

export type ThemeRadius = "none" | "small" | "medium" | "large"

export type ThemeFont = "inter" | "noto-sans" | "nunito-sans" | "figtree"

export interface ThemeConfig {
  mode: ThemeMode
  style: ThemeStyle
  themeColor: ThemeColor
  baseColor: BaseColor
  radius: ThemeRadius
  font: ThemeFont
}

export const defaultThemeConfig: ThemeConfig = {
  mode: "dark",
  style: "vega",
  themeColor: "neutral",
  baseColor: "neutral",
  radius: "medium",
  font: "inter",
}

export const THEME_STORAGE_KEY = "data-weaver-theme-config"

// Labels and descriptions for UI
export const styleMeta: Record<ThemeStyle, { label: string; description: string }> = {
  vega: { label: "Vega", description: "Classic look. Clean, neutral, familiar." },
  nova: { label: "Nova", description: "Reduced padding and margins for compact layouts." },
  mala: { label: "Mala", description: "Soft and rounded, with generous spacing." },
  lyra: { label: "Lyra", description: "Boxy and sharp. Pairs well with mono fonts." },
  mira: { label: "Mira", description: "Compact. Made for dense interfaces." },
}

export const themeColorMeta: Record<ThemeColor, { label: string; hue: number }> = {
  neutral: { label: "Neutral", hue: 0 },
  amber: { label: "Amber", hue: 45 },
  blue: { label: "Blue", hue: 217 },
  cyan: { label: "Cyan", hue: 190 },
  emerald: { label: "Emerald", hue: 160 },
  fuchsia: { label: "Fuchsia", hue: 290 },
  green: { label: "Green", hue: 142 },
  indigo: { label: "Indigo", hue: 230 },
  lime: { label: "Lime", hue: 85 },
  orange: { label: "Orange", hue: 25 },
  pink: { label: "Pink", hue: 340 },
}

export const baseColorMeta: Record<BaseColor, { label: string; description: string }> = {
  neutral: { label: "Neutral", description: "Pure gray" },
  stone: { label: "Stone", description: "Warm gray" },
  zinc: { label: "Zinc", description: "Cool gray" },
  gray: { label: "Gray", description: "Standard gray" },
}

export const radiusMeta: Record<ThemeRadius, { label: string; value: string }> = {
  none: { label: "None", value: "0" },
  small: { label: "Small", value: "0.25rem" },
  medium: { label: "Medium", value: "0.5rem" },
  large: { label: "Large", value: "0.75rem" },
}

export const fontMeta: Record<ThemeFont, { label: string; family: string; googleFont: string }> = {
  inter: { label: "Inter", family: "Inter, sans-serif", googleFont: "Inter:wght@400;500;600;700" },
  "noto-sans": { label: "Noto Sans", family: "'Noto Sans', sans-serif", googleFont: "Noto+Sans:wght@400;500;600;700" },
  "nunito-sans": { label: "Nunito Sans", family: "'Nunito Sans', sans-serif", googleFont: "Nunito+Sans:wght@400;500;600;700" },
  figtree: { label: "Figtree", family: "Figtree, sans-serif", googleFont: "Figtree:wght@400;500;600;700" },
}
