import React, { useRef, useEffect, useState } from 'react';

/* ─────────────────────────────────────────────────────────────
   Helper — pulls a CSS variable value
   Usage: v('brand-green') → 'var(--color-brand-green)'
───────────────────────────────────────────────────────────── */
const v = (name) => `var(--color-${name})`;

/* ─────────────────────────────────────────────────────────────
   MedicalCodingChat
───────────────────────────────────────────────────────────── */
const MedicalCodingChat = ({
  messages = [],
  input = '',
  onInputChange,
  onSend,
  isTyping = false,
  darkMode = true,
}) => {
  const messagesEndRef        = useRef(null);
  const messagesContainerRef  = useRef(null);
  const textareaRef           = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [shouldAutoScroll,  setShouldAutoScroll]  = useState(true);

  const scrollToBottom = (behavior = 'smooth') =>
    messagesEndRef.current?.scrollIntoView({ behavior });

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!nearBottom);
    setShouldAutoScroll(nearBottom);
  };

  useEffect(() => { if (shouldAutoScroll) scrollToBottom(); }, [messages, shouldAutoScroll]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  /* Page background — dark navy OR light green→blue wash */
  const pageStyle = {
    background: darkMode
      ? `linear-gradient(to bottom right, ${v('dark-bg-from')}, ${v('dark-bg-via')}, ${v('dark-bg-to')})`
      : `linear-gradient(to bottom right, ${v('light-bg-from')}, ${v('light-bg-via')}, ${v('light-bg-to')})`,
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full transition-all duration-300 relative" style={pageStyle}>

      {isEmpty ? (
        /* ── Empty state: input centred ── */
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-3xl">
            <InputBox
              textareaRef={textareaRef}
              input={input}
              onInputChange={onInputChange}
              onKeyPress={handleKeyPress}
              onSend={onSend}
              darkMode={darkMode}
            />
          </div>
        </div>
      ) : (
        <>
          {/* ── Messages ── */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto pt-8 pb-6"
          >
            <div className="max-w-3xl mx-auto px-6">
              {messages.map((message) => (
                <MessageRow key={message.id} message={message} darkMode={darkMode} />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="py-6">
                  <div className="flex gap-1.5">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: darkMode ? v('brand-green') : v('brand-green-hover'),
                          animationDelay: `${delay}ms`,
                          animationDuration: '1s',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Scroll-to-bottom button */}
          {showScrollButton && (
            <ScrollButton
              darkMode={darkMode}
              onClick={() => { setShouldAutoScroll(true); scrollToBottom(); }}
            />
          )}

          {/* ── Bottom input ── */}
          <div className="flex-shrink-0 flex justify-center py-6 px-6">
            <div className="w-full max-w-3xl">
              <InputBox
                textareaRef={textareaRef}
                input={input}
                onInputChange={onInputChange}
                onKeyPress={handleKeyPress}
                onSend={onSend}
                darkMode={darkMode}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   InputBox
───────────────────────────────────────────────────────────── */
const InputBox = ({ textareaRef, input, onInputChange, onKeyPress, onSend, darkMode }) => {
  const hasText = !!input.trim();

  const wrapperStyle = {
    background: darkMode
      ? `linear-gradient(to bottom right, ${v('dark-surface-from')}e6, ${v('dark-surface-to')}e6)`
      : `linear-gradient(to bottom right, ${v('light-surface-from')}, ${v('light-surface-to')})`,
    borderColor: darkMode ? `${v('dark-border')}99` : v('light-border'),
    boxShadow: darkMode
      ? `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${v('dark-border')}40`
      : `0 8px 32px rgba(59,130,246,0.06)`,
  };

  /* Send button: green→blue gradient matching logo */
  const btnActiveStyle = {
    background: `linear-gradient(135deg, ${v('brand-gradient-from')}, ${v('brand-gradient-to')})`,
    color: '#ffffff',
    boxShadow: `0 4px 14px ${v('dark-accent-glow')}`,
  };

  const btnDisabledStyle = {
    background: darkMode ? v('dark-btn-disabled-bg') : v('light-btn-disabled-bg'),
    color:      darkMode ? v('dark-btn-disabled-text') : v('light-btn-disabled-text'),
    cursor: 'not-allowed',
  };

  return (
    <div
      className="flex items-end gap-3 rounded-2xl px-4 py-3 backdrop-blur-sm border"
      style={wrapperStyle}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Ask about medical codes..."
        className="flex-1 py-2 resize-none outline-none max-h-[200px] overflow-y-auto bg-transparent"
        style={{
          minHeight: '24px',
          color: darkMode ? v('dark-text-primary') : v('light-text-primary'),
          caretColor: v('brand-green'),
        }}
        rows={1}
      />
      <button
        onClick={onSend}
        disabled={!hasText}
        className="p-2.5 rounded-xl transition-all duration-200 flex-shrink-0"
        style={hasText ? btnActiveStyle : btnDisabledStyle}
        onMouseEnter={(e) => {
          if (hasText)
            e.currentTarget.style.background =
              `linear-gradient(135deg, ${v('brand-gradient-hover-from')}, ${v('brand-gradient-hover-to')})`;
        }}
        onMouseLeave={(e) => {
          if (hasText)
            e.currentTarget.style.background =
              `linear-gradient(135deg, ${v('brand-gradient-from')}, ${v('brand-gradient-to')})`;
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ScrollButton
───────────────────────────────────────────────────────────── */
const ScrollButton = ({ darkMode, onClick }) => {
  const style = {
    background:   darkMode ? v('dark-surface-from') : v('light-scroll-btn-bg'),
    borderColor:  darkMode ? v('dark-border')        : v('light-border-solid'),
    color:        darkMode ? v('dark-text-primary')  : v('light-text-primary'),
  };

  return (
    <button
      onClick={onClick}
      className="absolute bottom-28 right-8 p-3 rounded-full shadow-lg transition-all duration-200 z-10 border"
      style={style}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          darkMode ? v('dark-surface-to') : v('light-scroll-btn-hover');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          darkMode ? v('dark-surface-from') : v('light-scroll-btn-bg');
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   MessageRow
───────────────────────────────────────────────────────────── */
const MessageRow = ({ message, darkMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyBtnStyle = {
    color: darkMode ? v('dark-text-muted') : v('light-text-muted'),
  };

  const CopyIcon = () =>
    copied ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );

  /* ── User bubble ── */
  if (message.type === 'user') {
    const bubbleStyle = {
      background: darkMode
        ? `linear-gradient(to bottom right, ${v('dark-surface-from')}, ${v('dark-surface-to')})`
        : `linear-gradient(to bottom right, ${v('light-bubble-from')}, ${v('light-bubble-to')})`,
      color:       darkMode ? v('dark-text-primary') : v('light-text-primary'),
      borderColor: darkMode ? `${v('dark-border')}4d` : v('light-bubble-border'),
    };

    return (
      <div className="py-6 flex justify-end group">
        <div className="flex items-start gap-2 flex-row-reverse">
          <div className="px-5 py-3 rounded-2xl max-w-[75%] border" style={bubbleStyle}>
            {message.content}
          </div>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg mt-1 flex-shrink-0"
            style={copyBtnStyle}
            title="Copy message"
          >
            <CopyIcon />
          </button>
        </div>
      </div>
    );
  }

  /* ── Assistant bubble ── */
  return (
    <div className="py-6 group">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <MarkdownContent content={message.content} isTyping={message.isTyping} darkMode={darkMode} />
        </div>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg flex-shrink-0"
          style={copyBtnStyle}
          title="Copy message"
        >
          <CopyIcon />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MarkdownContent
───────────────────────────────────────────────────────────── */
const MarkdownContent = ({ content, isTyping, darkMode }) => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [isComplete,     setIsComplete]     = useState(false);

  useEffect(() => {
    if (isTyping) {
      const lines = content.split('\n');
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < lines.length) {
          const add = Math.random() > 0.5 ? 2 : 1;
          setDisplayedLines(lines.slice(0, currentIndex + add));
          currentIndex += add;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, 80);
      return () => clearInterval(interval);
    } else {
      setDisplayedLines(content.split('\n'));
      setIsComplete(true);
    }
  }, [content, isTyping]);

  const renderMarkdown = (text) => {
    /* Bold */
    const textColor = darkMode ? v('dark-text-primary') : v('light-text-primary');
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      `<strong style="font-weight:600;color:${textColor}">$1</strong>`
    );

    /* Inline code — green-accented */
    const codeBg  = darkMode ? v('dark-code-bg')     : v('light-code-bg');
    const codeTxt = darkMode ? v('dark-code-text')   : v('light-code-text');
    const codeBdr = darkMode ? v('dark-code-border') : v('light-code-border');
    text = text.replace(/`([^`]+)`/g, (_, code) =>
      `<code style="background:${codeBg};color:${codeTxt};border:1px solid ${codeBdr};padding:2px 8px;border-radius:6px;font-size:0.875em;font-family:monospace">${code}</code>`
    );

    return text;
  };

  return (
    <div
      className="leading-relaxed"
      style={{ color: darkMode ? v('dark-text-primary') : v('light-text-primary') }}
    >
      {displayedLines.map((line, index) => (
        <div
          key={index}
          className="opacity-0 animate-fadeIn"
          style={{ animationDelay: `${index * 20}ms`, animationFillMode: 'forwards' }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(line) || '<br/>' }}
        />
      ))}
      {!isComplete && (
        <span
          className="inline-block w-0.5 h-5 ml-0.5 animate-pulse"
          style={{ backgroundColor: v('brand-green') }}
        />
      )}
    </div>
  );
};

export default MedicalCodingChat;