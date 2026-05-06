export const LinkButton = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="font-medium transition-colors duration-200"
    style={{ color: 'var(--color-brand-green)' }}
    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brand-green-hover)'}
    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-brand-green)'}
  >
    {children}
  </button>
);