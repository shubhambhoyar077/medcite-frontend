import { AlertCircle } from 'lucide-react';
export const ErrorBanner = ({ message }) => (
  <div
    className="p-3 rounded-lg text-sm flex items-center gap-2"
    style={{
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.25)',
      color: 'var(--color-status-error-text)',
    }}
  >
    <AlertCircle size={15} />
    {message}
  </div>
);