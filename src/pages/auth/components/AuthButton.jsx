const AuthButton = ({ children, loading, variant = 'primary', onClick }) => {
  const styles = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-brand-green), var(--color-brand-blue))',
      color: '#ffffff',
    },
    secondary: {
      background: 'var(--color-dark-surface-to)',
      color: 'var(--color-dark-text-primary)',
      border: '1px solid var(--color-dark-border)',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={styles[variant]}
      onMouseEnter={(e) => {
        if (!loading && variant === 'primary') {
          e.currentTarget.style.background =
            'linear-gradient(135deg, var(--color-brand-green-hover), var(--color-brand-blue-hover))';
          e.currentTarget.style.boxShadow = '0 4px 20px var(--color-dark-accent-glow)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.background =
            'linear-gradient(135deg, var(--color-brand-green), var(--color-brand-blue))';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : children}
    </button>
  );
};

export default AuthButton;