import type { HTMLAttributes } from 'react';
import { colors, radii, spacing, typography } from './tokens';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { background: string; color: string }> = {
  neutral: {
    background: 'rgba(148, 163, 184, 0.18)',
    color: colors.neutral,
  },
  primary: {
    background: 'rgba(99, 102, 241, 0.16)',
    color: colors.primary,
  },
  success: {
    background: 'rgba(34, 197, 94, 0.16)',
    color: colors.success,
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.16)',
    color: colors.warning,
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.16)',
    color: colors.danger,
  },
};

export function Badge({ variant = 'neutral', style, children, ...props }: BadgeProps) {
  const palette = variantStyles[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing.xs} ${spacing.sm}`,
        borderRadius: radii.pill,
        fontFamily: typography.fonts.sans,
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium,
        textTransform: 'capitalize',
        background: palette.background,
        color: palette.color,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
