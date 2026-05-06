import { useState, useEffect } from 'react';

const v = (name) => `var(--color-${name})`;

/* ── CopyButton ── */
const CopyButton = ({ text, darkMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy"
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded flex-shrink-0"
      style={{ color: darkMode ? v('dark-text-placeholder') : v('light-text-placeholder') }}
    >
      {copied ? (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

/* ── MarkdownContent ── */
export const MarkdownContent = ({ content, isTyping, darkMode }) => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isTyping) {
      const lines = content.split('\n');
      let i = 0;
      const interval = setInterval(() => {
        if (i < lines.length) {
          const add = Math.random() > 0.5 ? 2 : 1;
          setDisplayedLines(lines.slice(0, i + add));
          i += add;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, 70);
      return () => clearInterval(interval);
    } else {
      setDisplayedLines(content.split('\n'));
      setIsComplete(true);
    }
  }, [content, isTyping]);

  const renderLine = (text) => {
    const textColor = darkMode ? v('dark-text-primary') : v('light-text-primary');
    /* bold */
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      `<strong style="font-weight:600;color:${textColor}">$1</strong>`
    );
    /* italic */
    text = text.replace(
      /\*(.*?)\*/g,
      `<em style="color:${darkMode ? v('dark-text-muted') : v('light-text-muted')}">$1</em>`
    );
    /* inline code */
    const codeBg  = darkMode ? v('dark-code-bg')     : v('light-code-bg');
    const codeTxt = darkMode ? v('dark-code-text')   : v('light-code-text');
    const codeBdr = darkMode ? v('dark-code-border') : v('light-code-border');
    text = text.replace(/`([^`]+)`/g, (_, code) =>
      `<code style="background:${codeBg};color:${codeTxt};border:1px solid ${codeBdr};padding:1px 6px;border-radius:4px;font-size:0.8em;font-family:monospace">${code}</code>`
    );
    return text;
  };

  return (
    /* text-sm for all AI message content */
    <div
      className="text-sm leading-relaxed"
      style={{ color: darkMode ? v('dark-text-primary') : v('light-text-primary') }}
    >
      {displayedLines.map((line, i) => (
        <div
          key={i}
          className="opacity-0 animate-fadeIn"
          style={{ animationDelay: `${i * 15}ms`, animationFillMode: 'forwards' }}
          dangerouslySetInnerHTML={{ __html: renderLine(line) || '<br/>' }}
        />
      ))}
      {!isComplete && (
        <span
          className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
          style={{ backgroundColor: v('brand-green') }}
        />
      )}
    </div>
  );
};

/* ── MessageBubble ── */
const MessageBubble = ({ message, darkMode }) => {
  const isUser = message.type === 'user';

  if (isUser) {
    return (
      <div className="py-3 flex justify-end group">
        <div className="flex items-start gap-1.5 flex-row-reverse max-w-[78%]">
          <div
            className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm"  /* text-sm — was text-base before */
            style={{
              background: darkMode
                ? v('dark-surface-to')
                : v('light-bubble-from'),
              color:       darkMode ? v('dark-text-primary') : v('light-text-primary'),
              border:      `1px solid ${darkMode ? v('dark-border') : v('light-bubble-border')}`,
            }}
          >
            {message.content}
          </div>
          <CopyButton text={message.content} darkMode={darkMode} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-3 group">
      <div className="flex items-start gap-1.5">
        <div className="flex-1 min-w-0">
          <MarkdownContent content={message.content} isTyping={message.isTyping} darkMode={darkMode} />
        </div>
        <CopyButton text={message.content} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default MessageBubble;