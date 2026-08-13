import * as React from 'react';
import { useThemeContext } from '../../state/ThemeContext';

/**
 * Every SCSS module in the app reads colors exclusively via 7 CSS custom
 * properties (--th-primary/secondary/bg/text/text-muted/border/card-bg) —
 * never a hard-coded hex value — so switching themes is just re-setting
 * these on one wrapping element. This is that element.
 */
export const ThemedRoot: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { theme } = useThemeContext();
  const style: React.CSSProperties & Record<string, string> = {
    '--th-primary': theme.palette.primary,
    '--th-secondary': theme.palette.secondary,
    '--th-bg': theme.palette.background,
    '--th-text': theme.palette.text,
    '--th-text-muted': theme.palette.textMuted,
    '--th-border': theme.palette.border,
    '--th-card-bg': theme.palette.cardBackground,
    background: 'var(--th-bg)',
    color: 'var(--th-text)',
    minHeight: '100%'
  };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};
