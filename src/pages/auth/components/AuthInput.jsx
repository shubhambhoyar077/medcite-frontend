import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const AuthInput = ({ icon: Icon, type = "text", label, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium" style={{ color: 'var(--color-dark-text-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: focused ? 'var(--color-brand-green)' : 'var(--color-dark-text-placeholder)' }}
          >
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full py-3 rounded-lg outline-none transition-all duration-200"
          style={{
            paddingLeft: Icon ? '2.75rem' : '1rem',
            paddingRight: type === 'password' ? '2.75rem' : '1rem',
            background: 'var(--color-dark-bg-from)',
            color: 'var(--color-dark-text-primary)',
            border: error
              ? '1px solid var(--color-status-error-text)'
              : focused
              ? '1px solid var(--color-brand-green)'
              : '1px solid var(--color-dark-border)',
            boxShadow: focused && !error
              ? '0 0 0 3px var(--color-dark-accent-glow)'
              : 'none',
          }}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{ color: 'var(--color-dark-text-placeholder)' }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-status-error-text)' }}>
          <AlertCircle size={13} />
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;