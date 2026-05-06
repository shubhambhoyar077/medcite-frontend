import { useRef, useEffect } from 'react';

const v = (n) => `var(--color-${n})`;

const ChatInput = ({ input, onInputChange, onSend, darkMode }) => {
  const textareaRef = useRef(null);
  const hasText = !!input.trim();
  const dk = darkMode;

  /* Auto-grow textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }, [input]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  /* 
    Wrapper border — solid 1.5px so it's always visible in dark mode.
    Uses a noticeably lighter shade than the page background.
  */
  const wrapStyle = {
    display: 'flex',
    alignItems: 'center',      /* vertically centres placeholder text with button */
    gap: '0.5rem',
    padding: '0.625rem 0.75rem',
    borderRadius: '0.875rem',
    background: dk ? v('dark-surface-from') : '#ffffff',
    border: `1.5px solid ${dk ? 'rgba(255,255,255,0.12)' : '#d1d5db'}`,
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const handleFocus = () => {
    const el = document.getElementById('chat-input-wrap');
    if (el) {
      el.style.borderColor = v('brand-green');
      el.style.boxShadow = dk
        ? '0 0 0 3px rgba(61,214,140,0.12)'
        : '0 0 0 3px rgba(61,214,140,0.10)';
    }
  };
  const handleBlur = () => {
    const el = document.getElementById('chat-input-wrap');
    if (el) {
      el.style.borderColor = dk ? 'rgba(255,255,255,0.12)' : '#d1d5db';
      el.style.boxShadow = 'none';
    }
  };

  /* 
    Send button:
    - Active  → brand gradient, fully opaque
    - Disabled → same shape but very subtle, clearly dimmed
      (not invisible — border + dim icon so user knows it's there)
  */
  const btnStyle = hasText
    ? {
        flexShrink: 0,
        width: 32, height: 32,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${v('brand-green')}, ${v('brand-blue')})`,
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'opacity 0.15s',
      }
    : {
        flexShrink: 0,
        width: 32, height: 32,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        color: dk ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        /* Visible outline so button shape is clear even when disabled */
        border: `1.5px solid ${dk ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
        cursor: 'not-allowed',
      };

  return (
    <div id="chat-input-wrap" style={wrapStyle}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Ask about medical codes..."
        rows={1}
        className="flex-1 resize-none outline-none bg-transparent text-sm"
        style={{
          minHeight: 22,
          maxHeight: 180,
          overflowY: 'auto',
          color: dk ? v('dark-text-primary') : '#111827',
          caretColor: v('brand-green'),
          /* 
            Vertically centred: textarea in single-line state
            is naturally aligned because parent uses align-items: center
            and textarea has no padding pushing it off.
          */
          paddingTop: 0,
          paddingBottom: 0,
          lineHeight: '22px',
        }}
      />

      <button
        onClick={hasText ? onSend : undefined}
        disabled={!hasText}
        style={btnStyle}
        onMouseEnter={(e) => { if (hasText) e.currentTarget.style.opacity = '0.85'; }}
        onMouseLeave={(e) => { if (hasText) e.currentTarget.style.opacity = '1'; }}
        aria-label="Send"
      >
        {/* Arrow up icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;