import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { colors, radii, shadows, spacing, typography } from './tokens';

export type ButtonVariant = 'primary' | 'ghost' | 'soft';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const baseStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  fontFamily: typography.fonts.sans,
  fontWeight: typography.fontWeights.medium,
  borderRadius: radii.md,
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
  textDecoration: 'none',
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: typography.fontSizes.sm,
  },
  md: {
    padding: `${spacing.md} ${spacing['2xl']}`,
    fontSize: typography.fontSizes.md,
  },
  lg: {
    padding: `${spacing.lg} calc(${spacing['2xl']} + 0.5rem)`,
    fontSize: typography.fontSizes.lg,
  },
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryAccent})`,
    color: colors.primaryContrast,
    boxShadow: shadows.medium,
  },
  ghost: {
    background: 'rgba(148, 163, 184, 0.18)',
    color: colors.neutral,
  },
  soft: {
    background: 'rgba(99, 102, 241, 0.12)',
    color: colors.primary,
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      style: inlineStyle,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    const sizeStyle = sizeStyles[size];
    const variantStyle = variantStyles[variant];

    const mergedStyle: CSSProperties = {
      ...baseStyles,
      ...sizeStyle,
      ...variantStyle,
      width: fullWidth ? '100%' : undefined,
      opacity: disabled ? 0.65 : 1,
      cursor: disabled ? 'not-allowed' : baseStyles.cursor,
      ...inlineStyle,
    };

    return (
      <button ref={ref} style={mergedStyle} disabled={disabled} {...rest}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
