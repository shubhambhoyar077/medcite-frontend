import React, {useState, useEffect} from "react";
import { Mail } from 'lucide-react';
import AuthLayout from "./components/AuthLayout";
import { useNavigate } from "react-router";
import ROUTES from "../../constants/Routes";
import { IconCircle } from "./Helpers/IconCircle";
import { InfoBox } from "./Helpers/InfoBox";
import { LinkButton } from "./components/LinkButton";
import { ErrorBanner } from "./components/ErrorBanner";

export const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const email = "test@gmail.com";
 
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);
 
  return (
    <AuthLayout title="Check your email" subtitle={`We sent a confirmation link to ${email}`}>
      <div className="text-center space-y-6">
        <IconCircle color="var(--color-brand-green)">
          <Mail size={28} color="white" />
        </IconCircle>
 
        <div className="space-y-2">
          <p className="text-sm" style={{ color: 'var(--color-dark-text-primary)' }}>
            Click the link in the email to set up your password and activate your account.
          </p>
          <p className="text-xs" style={{ color: 'var(--color-dark-text-placeholder)' }}>
            The link will expire in 24 hours.
          </p>
        </div>
 
        <div className="space-y-3 pt-2">
          <p className="text-sm" style={{ color: 'var(--color-dark-text-muted)' }}>
            Didn't receive the email?{' '}
            <button
              type="button"
              onClick={() => setCountdown(60)}
              disabled={countdown > 0}
              className="font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: 'var(--color-brand-green)' }}
            >
              {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
            </button>
          </p>
          <LinkButton onClick={() => navigate(ROUTES.SIGNIN)}>← Back to sign in</LinkButton>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ConfirmationPage;