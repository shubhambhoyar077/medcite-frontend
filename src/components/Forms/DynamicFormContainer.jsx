import React from 'react';

const DynamicFormContainer = ({
  children,
  size = 'medium',
  maxWidth,
  width,
  alignment = 'center',
  verticalAlignment = 'top',
  withShadow = true,
  withBorder = true,
  transparent = false,
  padding = 'normal',
  darkMode = false,
  className = '',
  style = {},
}) => {
  const v  = (n) => `var(--color-${n})`;
  const dk = darkMode;

  const sizeMap = {
    small:  { maxWidth: '400px',  width: '100%' },
    medium: { maxWidth: '600px',  width: '100%' },
    large:  { maxWidth: '800px',  width: '100%' },
    full:   { maxWidth: '100%',   width: '100%' },
    custom: { maxWidth: maxWidth || '600px', width: width || '100%' },
  };

  const alignH = { left: 'flex-start', center: 'center', right: 'flex-end' }[alignment]        ?? 'center';
  const alignV = { top: 'flex-start', center: 'center', bottom: 'flex-end' }[verticalAlignment] ?? 'flex-start';

  const paddingMap = { none: '0', small: '1rem', normal: '1.5rem', large: '2.5rem' };

  /* Surface colors driven by darkMode */
  const surfaceBg     = dk ? v('dark-surface-from')  : v('neutral-bg-primary');
  const borderColor   = dk ? v('dark-border')         : v('neutral-border');
  const shadowValue   = dk
    ? '0 4px 24px rgba(0,0,0,0.35)'
    : '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)';

  return (
    <div
      className="w-full h-full flex"
      style={{
        justifyContent: alignH,
        alignItems: alignV,
        minHeight: verticalAlignment === 'center' ? '100vh' : 'auto',
        padding: '1rem',
      }}
    >
      <div
        className={className}
        style={{
          ...(sizeMap[size] ?? sizeMap.medium),
          padding:         transparent ? '0'           : paddingMap[padding] ?? '1.5rem',
          background:      transparent ? 'transparent' : surfaceBg,
          borderRadius:    transparent ? '0'           : '12px',
          border:          transparent ? 'none'        : (withBorder ? `1px solid ${borderColor}` : 'none'),
          boxShadow:       transparent ? 'none'        : (withShadow ? shadowValue : 'none'),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DynamicFormContainer;