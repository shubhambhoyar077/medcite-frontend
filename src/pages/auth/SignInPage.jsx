import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from "./components/AuthLayout";
import ROUTES from "../../constants/Routes";
import AuthButton from "./components/AuthButton";
import AuthInput from "./components/AuthInput";
import { useAuth } from "./hooks/authHooks";
import { LinkButton } from "./components/LinkButton";
import { ErrorBanner } from "./components/ErrorBanner";

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    const result = await login(formData);
    if (result.success) {
      // navigate to dashboard
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <div className="space-y-5">
        <AuthInput
          icon={Mail} type="email" label="Email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          error={errors.email}
        />
        <AuthInput
          icon={Lock} type="password" label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          error={errors.password}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--color-brand-green)' }}
            />
            <span style={{ color: 'var(--color-dark-text-muted)' }}>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: 'var(--color-brand-green)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brand-green-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-brand-green)'}
          >
            Forgot password?
          </button>
        </div>

        {errors.submit && <ErrorBanner message={errors.submit} />}

        <AuthButton loading={isLoggingIn} onClick={handleSubmit}>Sign In</AuthButton>

        <p className="text-center text-sm" style={{ color: 'var(--color-dark-text-muted)' }}>
          Don't have an account?{' '}
          <LinkButton onClick={() => navigate(ROUTES.SIGNUP)}>Sign up</LinkButton>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;