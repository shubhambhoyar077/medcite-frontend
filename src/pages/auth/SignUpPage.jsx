import React, { useState } from "react";
import { Mail } from 'lucide-react';
import AuthLayout from "./components/AuthLayout";
import { useNavigate } from "react-router";
import ROUTES from "../../constants/Routes";
import AuthInput from "./components/AuthInput";
import AuthButton from "./components/AuthButton";
import { useAuth } from "./hooks/authHooks";
import { LinkButton } from "./components/LinkButton";
import { ErrorBanner } from "./components/ErrorBanner";
import { InfoBox } from "./Helpers/InfoBox";
import { IconCircle } from "./Helpers/IconCircle";

export const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, isRegistering } = useAuth();
 
  const handleSubmit = async () => {
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Email is invalid'); return; }
    const result = await register({ email });
    if (result.success) navigate(ROUTES.CONFIRMATION, { state: email });
    else setError(result.error);
  };
 
  return (
    <AuthLayout title="Create your account" subtitle="Enter your email to get started">
      <div className="space-y-5">
        <AuthInput
          icon={Mail} type="email" label="Email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          error={error}
        />
 
        <InfoBox>
          We'll send you a confirmation link to set up your password.
        </InfoBox>
 
        <AuthButton loading={isRegistering} onClick={handleSubmit}>Continue</AuthButton>
 
        <p className="text-center text-sm" style={{ color: 'var(--color-dark-text-muted)' }}>
          Already have an account?{' '}
          <LinkButton onClick={() => navigate(ROUTES.SIGNIN)}>Sign in</LinkButton>
        </p>
      </div>
    </AuthLayout>
  );
};
 
export default SignUpPage;
