export const InfoBox = ({ children }) => (
  <div
    className="p-4 rounded-lg text-sm"
    style={{
      background: 'var(--color-dark-surface-from)',
      border: '1px solid var(--color-dark-border)',
      borderLeft: '3px solid var(--color-brand-green)',
      color: 'var(--color-dark-text-muted)',
    }}
  >
    {children}
  </div>
);
