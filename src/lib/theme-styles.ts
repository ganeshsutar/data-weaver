// Style presets for spacing, density, and visual characteristics
// These affect component sizing, padding, gaps, and radius modifiers

import type { ThemeStyle } from "./theme-config"

export interface StylePreset {
  // Base spacing unit
  spacingUnit: string
  // Card padding
  paddingCard: string
  // Button padding
  paddingButton: string
  // Default gap between elements
  gapDefault: string
  // Radius multiplier (applied to --radius)
  radiusMultiplier: number
  // Font size adjustments
  fontSizeBase: string
  // Line height
  lineHeight: string
}

export const stylePresets: Record<ThemeStyle, StylePreset> = {
  // Vega: Classic shadcn/ui look - clean, neutral, familiar
  vega: {
    spacingUnit: "1rem",
    paddingCard: "1.5rem",
    paddingButton: "0.5rem 1rem",
    gapDefault: "1rem",
    radiusMultiplier: 1,
    fontSizeBase: "0.875rem",
    lineHeight: "1.5",
  },

  // Nova: Reduced padding and margins for compact layouts
  nova: {
    spacingUnit: "0.75rem",
    paddingCard: "1rem",
    paddingButton: "0.375rem 0.75rem",
    gapDefault: "0.75rem",
    radiusMultiplier: 0.75,
    fontSizeBase: "0.875rem",
    lineHeight: "1.4",
  },

  // Mala: Soft and rounded, with generous spacing
  mala: {
    spacingUnit: "1.25rem",
    paddingCard: "2rem",
    paddingButton: "0.625rem 1.25rem",
    gapDefault: "1.25rem",
    radiusMultiplier: 1.5,
    fontSizeBase: "0.9375rem",
    lineHeight: "1.6",
  },

  // Lyra: Boxy and sharp, pairs well with mono fonts
  lyra: {
    spacingUnit: "1rem",
    paddingCard: "1.5rem",
    paddingButton: "0.5rem 1rem",
    gapDefault: "1rem",
    radiusMultiplier: 0, // Forces 0 radius
    fontSizeBase: "0.875rem",
    lineHeight: "1.5",
  },

  // Mira: Compact, made for dense interfaces
  mira: {
    spacingUnit: "0.5rem",
    paddingCard: "0.75rem",
    paddingButton: "0.25rem 0.5rem",
    gapDefault: "0.5rem",
    radiusMultiplier: 0.5,
    fontSizeBase: "0.8125rem",
    lineHeight: "1.35",
  },
}

// CSS variables for styles
export function getStyleCSSVariables(style: ThemeStyle): Record<string, string> {
  const preset = stylePresets[style]
  return {
    "--spacing-unit": preset.spacingUnit,
    "--padding-card": preset.paddingCard,
    "--padding-button": preset.paddingButton,
    "--gap-default": preset.gapDefault,
    "--radius-multiplier": String(preset.radiusMultiplier),
    "--font-size-base": preset.fontSizeBase,
    "--line-height-base": preset.lineHeight,
  }
}
