const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'sm',
  darkMode = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  const v = (n) => `var(--color-${n})`;
  const dk = darkMode;

  const cardBg      = dk ? v('dark-surface-from')      : v('neutral-bg-primary');
  const cardBg2     = dk ? v('dark-surface-to')         : v('neutral-bg-secondary');
  const headerBg    = dk ? 'rgba(61,214,140,0.04)'      : `${v('brand-green-light')}`;
  const borderColor = dk ? v('dark-border')             : v('neutral-border');
  const titleColor  = dk ? v('dark-text-primary')       : v('neutral-text-primary');
  const descColor   = dk ? v('dark-text-placeholder')   : v('neutral-text-tertiary');
  const closeBg     = dk ? v('dark-bg-from')            : v('neutral-bg-primary');
  const closeColor  = dk ? v('dark-text-muted')         : v('neutral-text-secondary');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(1px)' }}
      onClick={onClose}
    >
      <div
        className={`w-full ${sizeClasses[size]} animate-slideUp`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(to bottom, ${cardBg}, ${cardBg2})`,
          borderRadius: '1.25rem',
          boxShadow: dk
            ? `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px ${borderColor}`
            : `0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px ${borderColor}`,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.75rem 1.75rem 1.25rem',
            borderBottom: `1px solid ${borderColor}`,
            background: headerBg,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold" style={{ color: titleColor }}>
                {title}
              </h2>
              {description && (
                <p className="text-sm mt-1" style={{ color: descColor }}>
                  {description}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded-lg transition-all duration-150"
              style={{
                color: closeColor,
                background: closeBg,
                border: `1px solid ${borderColor}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = v('brand-green');
                e.currentTarget.style.color = v('brand-green');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.color = closeColor;
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto flex-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: `${borderColor} transparent` }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .animate-fadeIn  { animation: fadeIn  0.18s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1); }
      `}</style>
    </div>
  );
};

export default Modal;