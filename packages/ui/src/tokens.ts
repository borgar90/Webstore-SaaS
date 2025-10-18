export const colors = {
  background: '#f6f8fb',
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',
  primary: '#6366f1',
  primaryAccent: '#8b5cf6',
  primaryContrast: '#ffffff',
  neutral: '#0f172a',
  neutralMuted: '#475569',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
} as const;

export const radii = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1.25rem',
  pill: '999px',
} as const;

export const shadows = {
  soft: '0 12px 24px rgba(15, 23, 42, 0.12)',
  medium: '0 20px 40px rgba(15, 23, 42, 0.16)',
  strong: '0 28px 60px rgba(15, 23, 42, 0.22)',
} as const;

export const typography = {
  fonts: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },
  fontWeights: {
    normal: 500,
    medium: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.35,
    relaxed: 1.6,
  },
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
export type ShadowToken = keyof typeof shadows;
export type FontSizeToken = keyof typeof typography.fontSizes;
