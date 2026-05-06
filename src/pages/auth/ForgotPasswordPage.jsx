import React, { useState } from "react";
import { Mail, CheckCircle } from 'lucide-react';
import AuthLayout from "./components/AuthLayout";
import { useNavigate } from "react-router";
import ROUTES from "../../constants/Routes";
import AuthInput from "./components/AuthInput";
import AuthButton from "./components/AuthButton";
import { useAuth } from "./hooks/authHooks";
import { IconCircle } from "./Helpers/IconCircle";
import { InfoBox } from "./Helpers/InfoBox";
import { LinkButton } from "./components/LinkButton";
import { ErrorBanner } from "./components/ErrorBanner";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword, isSendingReset } = useAuth();
 
  const handleSubmit = async () => {
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Email is invalid'); return; }
    const result = await forgotPassword(email);
    if (result.success) setSuccess(true);
    else setError(result.error);
  };
 
  if (success) {
    return (
      <AuthLayout title="Check your email" subtitle={`Reset link sent to ${email}`}>
        <div className="text-center space-y-6">
          <IconCircle color="var(--color-brand-green)">
            <CheckCircle size={28} color="white" />
          </IconCircle>
          <div className="space-y-2">
            <p className="text-sm" style={{ color: 'var(--color-dark-text-primary)' }}>
              We've sent a password reset link. Click it to create a new password.
            </p>
            <p className="text-xs" style={{ color: 'var(--color-dark-text-placeholder)' }}>
              The link will expire in 1 hour.
            </p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setSuccess(false)}
              className="text-sm transition-colors duration-200"
              style={{ color: 'var(--color-dark-text-muted)' }}
            >
              Didn't receive it? Try again
            </button>
            <div>
              <LinkButton onClick={() => navigate(ROUTES.SIGNIN)}>← Back to sign in</LinkButton>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }
 
  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email to reset your password">
      <div className="space-y-5">
        <AuthInput
          icon={Mail} type="email" label="Email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          error={error}
        />
        <InfoBox>We'll send you a link to reset your password.</InfoBox>
        {error && <ErrorBanner message={error} />}
        <AuthButton loading={isSendingReset} onClick={handleSubmit}>Send Reset Link</AuthButton>
        <p className="text-center text-sm" style={{ color: 'var(--color-dark-text-muted)' }}>
          Remember your password?{' '}
          <LinkButton onClick={() => navigate(ROUTES.SIGNIN)}>Sign in</LinkButton>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;