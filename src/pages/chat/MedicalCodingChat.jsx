import { useRef, useEffect, useState } from 'react';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';

const v = (name) => `var(--color-${name})`;

/* ─────────────────────────────────────────────────────────────
   ScrollToBottomButton
───────────────────────────────────────────────────────────── */
const ScrollToBottomButton = ({ darkMode, onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-28 right-8 p-3 rounded-full shadow-lg transition-all duration-200 z-10 border"
    style={{
      background:   darkMode ? v('dark-surface-from') : v('light-scroll-btn-bg'),
      borderColor:  darkMode ? v('dark-border')        : v('light-border-solid'),
      color:        darkMode ? v('dark-text-primary')  : v('light-text-primary'),
    }}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </button>
);

/* ─────────────────────────────────────────────────────────────
   EmptyState — shown when no messages yet
───────────────────────────────────────────────────────────── */
const EmptyState = ({ input, onInputChange, onSend, darkMode }) => (
  <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
    <div className="text-center">
      <h2
        className="text-2xl font-semibold mb-2"
        style={{ color: darkMode ? v('dark-text-primary') : v('light-text-primary') }}
      >
        Medical Coding Assistant
      </h2>
      <p className="text-sm" style={{ color: darkMode ? v('dark-text-muted') : v('light-text-muted') }}>
        Ask about ICD-10, CPT codes, modifiers and more.
      </p>
    </div>
    <div className="w-full max-w-3xl">
      <ChatInput input={input} onInputChange={onInputChange} onSend={onSend} darkMode={darkMode} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MedicalCodingChat — orchestrator
───────────────────────────────────────────────────────────── */
const MedicalCodingChat = ({ messages, input, onInputChange, onSend, isTyping, darkMode }) => {
  const messagesEndRef       = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton,  setShowScrollButton]  = useState(false);
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

  useEffect(() => {
    if (shouldAutoScroll) scrollToBottom();
  }, [messages, shouldAutoScroll]);

  const pageStyle = {
    background: darkMode
      ? `linear-gradient(to bottom right, ${v('dark-bg-from')}, ${v('dark-bg-via')}, ${v('dark-bg-to')})`
      : `linear-gradient(to bottom right, ${v('light-bg-from')}, ${v('light-bg-via')}, ${v('light-bg-to')})`,
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full transition-all duration-300 relative" style={pageStyle}>
      {isEmpty ? (
        <EmptyState
          input={input}
          onInputChange={onInputChange}
          onSend={onSend}
          darkMode={darkMode}
        />
      ) : (
        <>
          {/* ── Message list ── */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto pt-8 pb-4"
          >
            <div className="max-w-3xl mx-auto px-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} darkMode={darkMode} />
              ))}
              {isTyping && <TypingIndicator darkMode={darkMode} />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {showScrollButton && (
            <ScrollToBottomButton
              darkMode={darkMode}
              onClick={() => { setShouldAutoScroll(true); scrollToBottom(); }}
            />
          )}

          {/* ── Input bar ── */}
          <div className="flex-shrink-0 flex justify-center py-6 px-6">
            <div className="w-full max-w-3xl">
              <ChatInput
                input={input}
                onInputChange={onInputChange}
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

export default MedicalCodingChat;