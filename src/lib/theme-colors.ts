// Color palettes for theme and base colors
// All values are HSL format: "hue saturation% lightness%"

import type { ThemeColor, BaseColor } from "./theme-config"

export interface ColorPalette {
  light: {
    primary: string
    primaryForeground: string
    ring: string
    chart1: string
    chart2: string
    chart3: string
    chart4: string
    chart5: string
  }
  dark: {
    primary: string
    primaryForeground: string
    ring: string
    chart1: string
    chart2: string
    chart3: string
    chart4: string
    chart5: string
  }
}

export interface BasePalette {
  light: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    border: string
    input: string
    sidebarBackground: string
    sidebarForeground: string
    sidebarPrimary: string
    sidebarPrimaryForeground: string
    sidebarAccent: string
    sidebarAccentForeground: string
    sidebarBorder: string
    sidebarRing: string
  }
  dark: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    border: string
    input: string
    sidebarBackground: string
    sidebarForeground: string
    sidebarPrimary: string
    sidebarPrimaryForeground: string
    sidebarAccent: string
    sidebarAccentForeground: string
    sidebarBorder: string
    sidebarRing: string
  }
}

// Theme color palettes (primary/accent colors)
export const themeColors: Record<ThemeColor, ColorPalette> = {
  neutral: {
    light: {
      primary: "0 0% 9%",
      primaryForeground: "0 0% 98%",
      ring: "0 0% 3.9%",
      chart1: "12 76% 61%",
      chart2: "173 58% 39%",
      chart3: "197 37% 24%",
      chart4: "43 74% 66%",
      chart5: "27 87% 67%",
    },
    dark: {
      primary: "0 0% 98%",
      primaryForeground: "0 0% 9%",
      ring: "0 0% 83.1%",
      chart1: "220 70% 50%",
      chart2: "160 60% 45%",
      chart3: "30 80% 55%",
      chart4: "280 65% 60%",
      chart5: "340 75% 55%",
    },
  },
  amber: {
    light: {
      primary: "45 93% 47%",
      primaryForeground: "45 100% 10%",
      ring: "45 93% 47%",
      chart1: "45 93% 47%",
      chart2: "35 91% 45%",
      chart3: "25 95% 53%",
      chart4: "40 96% 40%",
      chart5: "30 90% 50%",
    },
    dark: {
      primary: "45 93% 47%",
      primaryForeground: "45 100% 10%",
      ring: "45 93% 47%",
      chart1: "45 93% 47%",
      chart2: "35 91% 55%",
      chart3: "25 95% 53%",
      chart4: "40 96% 50%",
      chart5: "30 90% 60%",
    },
  },
  blue: {
    light: {
      primary: "217 91% 60%",
      primaryForeground: "0 0% 100%",
      ring: "217 91% 60%",
      chart1: "217 91% 60%",
      chart2: "199 89% 48%",
      chart3: "212 95% 68%",
      chart4: "224 76% 48%",
      chart5: "190 90% 50%",
    },
    dark: {
      primary: "217 91% 60%",
      primaryForeground: "0 0% 100%",
      ring: "217 91% 60%",
      chart1: "217 91% 60%",
      chart2: "199 89% 58%",
      chart3: "212 95% 68%",
      chart4: "224 76% 58%",
      chart5: "190 90% 60%",
    },
  },
  cyan: {
    light: {
      primary: "190 95% 39%",
      primaryForeground: "0 0% 100%",
      ring: "190 95% 39%",
      chart1: "190 95% 39%",
      chart2: "180 91% 36%",
      chart3: "200 98% 45%",
      chart4: "175 84% 32%",
      chart5: "185 96% 42%",
    },
    dark: {
      primary: "190 95% 39%",
      primaryForeground: "0 0% 100%",
      ring: "190 95% 39%",
      chart1: "190 95% 49%",
      chart2: "180 91% 46%",
      chart3: "200 98% 55%",
      chart4: "175 84% 42%",
      chart5: "185 96% 52%",
    },
  },
  emerald: {
    light: {
      primary: "160 84% 39%",
      primaryForeground: "0 0% 100%",
      ring: "160 84% 39%",
      chart1: "160 84% 39%",
      chart2: "142 76% 36%",
      chart3: "168 84% 42%",
      chart4: "152 69% 31%",
      chart5: "158 64% 52%",
    },
    dark: {
      primary: "160 84% 39%",
      primaryForeground: "0 0% 100%",
      ring: "160 84% 39%",
      chart1: "160 84% 49%",
      chart2: "142 76% 46%",
      chart3: "168 84% 52%",
      chart4: "152 69% 41%",
      chart5: "158 64% 52%",
    },
  },
  fuchsia: {
    light: {
      primary: "290 90% 51%",
      primaryForeground: "0 0% 100%",
      ring: "290 90% 51%",
      chart1: "290 90% 51%",
      chart2: "300 76% 42%",
      chart3: "280 85% 65%",
      chart4: "270 91% 65%",
      chart5: "310 80% 55%",
    },
    dark: {
      primary: "290 90% 51%",
      primaryForeground: "0 0% 100%",
      ring: "290 90% 51%",
      chart1: "290 90% 61%",
      chart2: "300 76% 52%",
      chart3: "280 85% 65%",
      chart4: "270 91% 65%",
      chart5: "310 80% 55%",
    },
  },
  green: {
    light: {
      primary: "142 76% 36%",
      primaryForeground: "0 0% 100%",
      ring: "142 76% 36%",
      chart1: "142 76% 36%",
      chart2: "122 39% 49%",
      chart3: "152 69% 31%",
      chart4: "132 60% 42%",
      chart5: "162 47% 50%",
    },
    dark: {
      primary: "142 76% 36%",
      primaryForeground: "0 0% 100%",
      ring: "142 76% 36%",
      chart1: "142 76% 46%",
      chart2: "122 39% 59%",
      chart3: "152 69% 41%",
      chart4: "132 60% 52%",
      chart5: "162 47% 50%",
    },
  },
  indigo: {
    light: {
      primary: "230 84% 60%",
      primaryForeground: "0 0% 100%",
      ring: "230 84% 60%",
      chart1: "230 84% 60%",
      chart2: "224 76% 48%",
      chart3: "240 68% 70%",
      chart4: "220 91% 54%",
      chart5: "250 72% 60%",
    },
    dark: {
      primary: "230 84% 60%",
      primaryForeground: "0 0% 100%",
      ring: "230 84% 60%",
      chart1: "230 84% 70%",
      chart2: "224 76% 58%",
      chart3: "240 68% 70%",
      chart4: "220 91% 64%",
      chart5: "250 72% 60%",
    },
  },
  lime: {
    light: {
      primary: "85 85% 35%",
      primaryForeground: "0 0% 100%",
      ring: "85 85% 35%",
      chart1: "85 85% 35%",
      chart2: "80 73% 40%",
      chart3: "90 72% 45%",
      chart4: "75 80% 30%",
      chart5: "95 70% 50%",
    },
    dark: {
      primary: "85 85% 45%",
      primaryForeground: "85 100% 10%",
      ring: "85 85% 45%",
      chart1: "85 85% 55%",
      chart2: "80 73% 50%",
      chart3: "90 72% 55%",
      chart4: "75 80% 40%",
      chart5: "95 70% 50%",
    },
  },
  orange: {
    light: {
      primary: "25 95% 53%",
      primaryForeground: "0 0% 100%",
      ring: "25 95% 53%",
      chart1: "25 95% 53%",
      chart2: "20 90% 48%",
      chart3: "30 100% 58%",
      chart4: "15 85% 45%",
      chart5: "35 92% 55%",
    },
    dark: {
      primary: "25 95% 53%",
      primaryForeground: "0 0% 100%",
      ring: "25 95% 53%",
      chart1: "25 95% 63%",
      chart2: "20 90% 58%",
      chart3: "30 100% 58%",
      chart4: "15 85% 55%",
      chart5: "35 92% 55%",
    },
  },
  pink: {
    light: {
      primary: "340 82% 52%",
      primaryForeground: "0 0% 100%",
      ring: "340 82% 52%",
      chart1: "340 82% 52%",
      chart2: "330 81% 60%",
      chart3: "350 80% 60%",
      chart4: "320 72% 50%",
      chart5: "355 85% 65%",
    },
    dark: {
      primary: "340 82% 52%",
      primaryForeground: "0 0% 100%",
      ring: "340 82% 52%",
      chart1: "340 82% 62%",
      chart2: "330 81% 60%",
      chart3: "350 80% 60%",
      chart4: "320 72% 60%",
      chart5: "355 85% 65%",
    },
  },
}

// Base color palettes (gray scales)
export const baseColors: Record<BaseColor, BasePalette> = {
  neutral: {
    light: {
      background: "0 0% 100%",
      foreground: "0 0% 3.9%",
      card: "0 0% 100%",
      cardForeground: "0 0% 3.9%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 3.9%",
      secondary: "0 0% 96.1%",
      secondaryForeground: "0 0% 9%",
      muted: "0 0% 96.1%",
      mutedForeground: "0 0% 45.1%",
      accent: "0 0% 96.1%",
      accentForeground: "0 0% 9%",
      border: "0 0% 89.8%",
      input: "0 0% 89.8%",
      sidebarBackground: "0 0% 98%",
      sidebarForeground: "240 5.3% 26.1%",
      sidebarPrimary: "240 5.9% 10%",
      sidebarPrimaryForeground: "0 0% 98%",
      sidebarAccent: "240 4.8% 95.9%",
      sidebarAccentForeground: "240 5.9% 10%",
      sidebarBorder: "220 13% 91%",
      sidebarRing: "217.2 91.2% 59.8%",
    },
    dark: {
      background: "0 0% 3.9%",
      foreground: "0 0% 98%",
      card: "0 0% 3.9%",
      cardForeground: "0 0% 98%",
      popover: "0 0% 3.9%",
      popoverForeground: "0 0% 98%",
      secondary: "0 0% 14.9%",
      secondaryForeground: "0 0% 98%",
      muted: "0 0% 14.9%",
      mutedForeground: "0 0% 63.9%",
      accent: "0 0% 14.9%",
      accentForeground: "0 0% 98%",
      border: "0 0% 14.9%",
      input: "0 0% 14.9%",
      sidebarBackground: "240 5.9% 10%",
      sidebarForeground: "240 4.8% 95.9%",
      sidebarPrimary: "224.3 76.3% 48%",
      sidebarPrimaryForeground: "0 0% 100%",
      sidebarAccent: "240 3.7% 15.9%",
      sidebarAccentForeground: "240 4.8% 95.9%",
      sidebarBorder: "240 3.7% 15.9%",
      sidebarRing: "217.2 91.2% 59.8%",
    },
  },
  stone: {
    light: {
      background: "0 0% 100%",
      foreground: "20 14.3% 4.1%",
      card: "0 0% 100%",
      cardForeground: "20 14.3% 4.1%",
      popover: "0 0% 100%",
      popoverForeground: "20 14.3% 4.1%",
      secondary: "60 4.8% 95.9%",
      secondaryForeground: "24 9.8% 10%",
      muted: "60 4.8% 95.9%",
      mutedForeground: "25 5.3% 44.7%",
      accent: "60 4.8% 95.9%",
      accentForeground: "24 9.8% 10%",
      border: "20 5.9% 90%",
      input: "20 5.9% 90%",
      sidebarBackground: "60 4.8% 98%",
      sidebarForeground: "24 9.8% 26%",
      sidebarPrimary: "24 9.8% 10%",
      sidebarPrimaryForeground: "60 4.8% 98%",
      sidebarAccent: "60 4.8% 95.9%",
      sidebarAccentForeground: "24 9.8% 10%",
      sidebarBorder: "20 5.9% 90%",
      sidebarRing: "217.2 91.2% 59.8%",
    },
    dark: {
      background: "20 14.3% 4.1%",
      foreground: "60 9.1% 97.8%",
      card: "20 14.3% 4.1%",
      cardForeground: "60 9.1% 97.8%",
      popover: "20 14.3% 4.1%",
      popoverForeground: "60 9.1% 97.8%",
      secondary: "12 6.5% 15.1%",
      secondaryForeground: "60 9.1% 97.8%",
      muted: "12 6.5% 15.1%",
      mutedForeground: "24 5.4% 63.9%",
      accent: "12 6.5% 15.1%",
      accentForeground: "60 9.1% 97.8%",
      border: "12 6.5% 15.1%",
      input: "12 6.5% 15.1%",
      sidebarBackground: "20 14.3% 8%",
      sidebarForeground: "60 9.1% 95%",
      sidebarPrimary: "224.3 76.3% 48%",
      sidebarPrimaryForeground: "0 0% 100%",
      sidebarAccent: "12 6.5% 15.1%",
      sidebarAccentForeground: "60 9.1% 95%",
      sidebarBorder: "12 6.5% 15.1%",
      sidebarRing: "217.2 91.2% 59.8%",
    },
  },
  zinc: {
    light: {
      background: "0 0% 100%",
      foreground: "240 10% 3.9%",
      card: "0 0% 100%",
      cardForeground: "240 10% 3.9%",
      popover: "0 0% 100%",
      popoverForeground: "240 10% 3.9%",
      secondary: "240 4.8% 95.9%",
      secondaryForeground: "240 5.9% 10%",
      muted: "240 4.8% 95.9%",
      mutedForeground: "240 3.8% 46.1%",
      accent: "240 4.8% 95.9%",
      accentForeground: "240 5.9% 10%",
      border: "240 5.9% 90%",
      input: "240 5.9% 90%",
      sidebarBackground: "240 4.8% 98%",
      sidebarForeground: "240 5.3% 26.1%",
      sidebarPrimary: "240 5.9% 10%",
      sidebarPrimaryForeground: "0 0% 98%",
      sidebarAccent: "240 4.8% 95.9%",
      sidebarAccentForeground: "240 5.9% 10%",
      sidebarBorder: "240 5.9% 90%",
      sidebarRing: "217.2 91.2% 59.8%",
    },
    dark: {
      background: "240 10% 3.9%",
      foreground: "0 0% 98%",
      card: "240 10% 3.9%",
      cardForeground: "0 0% 98%",
      popover: "240 10% 3.9%",
      popoverForeground: "0 0% 98%",
      secondary: "240 3.7% 15.9%",
      secondaryForeground: "0 0% 98%",
      muted: "240 3.7% 15.9%",
      mutedForeground: "240 5% 64.9%",
      accent: "240 3.7% 15.9%",
      accentForeground: "0 0% 98%",
      border: "240 3.7% 15.9%",
      input: "240 3.7% 15.9%",
      sidebarBackground: "240 5.9% 10%",
      sidebarForeground: "240 4.8% 95.9%",
      sidebarPrimary: "224.3 76.3% 48%",
      sidebarPrimaryForeground: "0 0% 100%",
      sidebarAccent: "240 3.7% 15.9%",
      sidebarAccentForeground: "240 4.8% 95.9%",
      sidebarBorder: "240 3.7% 15.9%",
      sidebarRing: "217.2 91.2% 59.8%",
    },
  },
  gray: {
    light: {
      background: "0 0% 100%",
      foreground: "224 71.4% 4.1%",
      card: "0 0% 100%",
      cardForeground: "224 71.4% 4.1%",
      popover: "0 0% 100%",
      popoverForeground: "224 71.4% 4.1%",
      secondary: "220 14.3% 95.9%",
      secondaryForeground: "220.9 39.3% 11%",
      muted: "220 14.3% 95.9%",
      mutedForeground: "220 8.9% 46.1%",
      accent: "220 14.3% 95.9%",
      accentForeground: "220.9 39.3% 11%",
      border: "220 13% 91%",
      input: "220 13% 91%",
      sidebarBackground: "220 14.3% 98%",
      sidebarForeground: "220.9 39.3% 26%",
      sidebarPrimary: "220.9 39.3% 11%",
      sidebarPrimaryForeground: "220 14.3% 98%",
      sidebarAccent: "220 14.3% 95.9%",
      sidebarAccentForeground: "220.9 39.3% 11%",
      sidebarBorder: "220 13% 91%",
      sidebarRing: "217.2 91.2% 59.8%",
    },
    dark: {
      background: "224 71.4% 4.1%",
      foreground: "210 20% 98%",
      card: "224 71.4% 4.1%",
      cardForeground: "210 20% 98%",
      popover: "224 71.4% 4.1%",
      popoverForeground: "210 20% 98%",
      secondary: "215 27.9% 16.9%",
      secondaryForeground: "210 20% 98%",
      muted: "215 27.9% 16.9%",
      mutedForeground: "217.9 10.6% 64.9%",
      accent: "215 27.9% 16.9%",
      accentForeground: "210 20% 98%",
      border: "215 27.9% 16.9%",
      input: "215 27.9% 16.9%",
      sidebarBackground: "224 71.4% 8%",
      sidebarForeground: "210 20% 95%",
      sidebarPrimary: "224.3 76.3% 48%",
      sidebarPrimaryForeground: "0 0% 100%",
      sidebarAccent: "215 27.9% 16.9%",
      sidebarAccentForeground: "210 20% 95%",
      sidebarBorder: "215 27.9% 16.9%",
      sidebarRing: "217.2 91.2% 59.8%",
    },
  },
}

// Destructive colors (consistent across all themes)
export const destructiveColors = {
  light: {
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "0 0% 98%",
  },
  dark: {
    destructive: "0 62.8% 30.6%",
    destructiveForeground: "0 0% 98%",
  },
}
