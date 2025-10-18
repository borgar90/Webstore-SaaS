import type { CSSProperties, HTMLAttributes } from 'react';
import { colors, radii, shadows, spacing, typography } from './tokens';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: keyof typeof spacing;
  elevation?: 'none' | 'soft' | 'medium';
  tone?: 'surface' | 'muted';
}

const elevationMap: Record<NonNullable<CardProps['elevation']>, string | undefined> = {
  none: undefined,
  soft: shadows.soft,
  medium: shadows.medium,
};

const toneMap: Record<NonNullable<CardProps['tone']>, string> = {
  surface: colors.surface,
  muted: colors.surfaceMuted,
};

export function Card({
  padding = 'lg',
  elevation = 'soft',
  tone = 'surface',
  style,
  children,
  ...props
}: CardProps) {
  const cardStyle: CSSProperties = {
    background: toneMap[tone],
    borderRadius: radii.lg,
    padding: spacing[padding],
    boxShadow: elevationMap[elevation],
    color: colors.neutral,
    fontFamily: typography.fonts.sans,
    border: '1px solid rgba(148, 163, 184, 0.18)',
    display: 'grid',
    gap: spacing.md,
    ...(style ?? {}),
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
}
