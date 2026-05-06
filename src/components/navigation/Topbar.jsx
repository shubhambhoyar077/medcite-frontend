import { Moon, Sun } from 'lucide-react';

const v = (n) => `var(--color-${n})`;

export default function Topbar({
  darkMode = true,
  onDarkModeToggle = () => {},
}) {
  const dk      = darkMode;
  /* Matches the chat page background exactly so topbar is invisible */
  const bg      = dk
    ? v('dark-bg-via')   /* same as MedicalCodingChat dark bg-via */
    : '#f8fafc';         /* same as MedicalCodingChat light bg-via */
  const hoverBg = dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const muted   = dk ? v('dark-text-placeholder') : '#9ca3af';

  return (
    <header
      className="flex-shrink-0 flex items-center justify-end px-4"
      style={{
        height: 48,
        background: bg,
        /* No border — blends completely into the chat background */
      }}
    >
      <button
        onClick={onDarkModeToggle}
        className="p-2 rounded-lg transition-colors"
        title={dk ? 'Light mode' : 'Dark mode'}
        style={{ color: muted }}
        onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        {dk
          ? <Sun size={17} style={{ color: '#fbbf24' }} />
          : <Moon size={17} style={{ color: v('brand-blue') }} />
        }
      </button>
    </header>
  );
}