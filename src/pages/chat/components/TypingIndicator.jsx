const v = (name) => `var(--color-${name})`;

const TypingIndicator = ({ darkMode }) => (
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
);

export default TypingIndicator;