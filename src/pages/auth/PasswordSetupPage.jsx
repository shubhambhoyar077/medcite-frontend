import React, { useState, useEffect } from "react";
import { Lock, AlertCircle } from 'lucide-react';
import AuthLayout from "./components/AuthLayout";
import AuthButton from "./components/AuthButton";
import AuthInput from "./components/AuthInput";
import { useNavigate, useSearchParams } from "react-router";
import ROUTES from "../../constants/Routes";
import { useAuth } from "./hooks/authHooks";
import { IconCircle } from "./Helpers/IconCircle";
import { InfoBox } from "./Helpers/InfoBox";
import { LinkButton } from "./components/LinkButton";
import { ErrorBanner } from "./components/ErrorBanner";

export const PasswordSetupPage = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [hasPassword, setHasPassword] = useState(false);
  const { validateToken, setPassword, isValidatingToken, isSettingPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
 
  useEffect(() => {
    const verifyToken = async () => {
      const result = await validateToken(uid, token);
      if (result.success) setHasPassword(result.data.has_password);
      else setErrors({ token: 'Invalid or expired link. Please request a new one.' });
    };
    verifyToken();
  }, [uid, token]);
 
  const validate = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };
 
  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    const result = await setPassword({ uid, token, password: formData.password, confirm_password: formData.confirmPassword });
    if (result.success) navigate(ROUTES.SIGNIN);
    else setErrors({ submit: result.error });
  };
 
  const requirements = [
    { label: 'At least 8 characters',   met: formData.password.length >= 8 },
    { label: 'One uppercase letter',     met: /[A-Z]/.test(formData.password) },
    { label: 'One lowercase letter',     met: /[a-z]/.test(formData.password) },
    { label: 'One number',               met: /\d/.test(formData.password) },
  ];
 
  if (isValidatingToken) {
    return (
      <AuthLayout title="Verifying…" subtitle="Please wait">
        <div className="flex justify-center py-8">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--color-brand-green)', borderTopColor: 'transparent' }}
          />
        </div>
      </AuthLayout>
    );
  }
 
  if (errors.token) {
    return (
      <AuthLayout title="Link expired" subtitle="This link is no longer valid">
        <div className="text-center space-y-6">
          <IconCircle color="var(--color-status-error-text)">
            <AlertCircle size={28} color="white" />
          </IconCircle>
          <p className="text-sm" style={{ color: 'var(--color-dark-text-muted)' }}>{errors.token}</p>
          <AuthButton onClick={() => navigate(ROUTES.SIGNUP)}>Request new link</AuthButton>
        </div>
      </AuthLayout>
    );
  }
 
  return (
    <AuthLayout
      title={hasPassword ? "Reset your password" : "Set up your password"}
      subtitle="Create a strong password for your account"
    >
      <div className="space-y-5">
        <AuthInput
          icon={Lock} type="password" label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />
        <AuthInput
          icon={Lock} type="password" label="Confirm Password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          error={errors.confirmPassword}
        />
 
        {/* Password requirements */}
        <div
          className="p-4 rounded-lg space-y-2"
          style={{ background: 'var(--color-dark-bg-from)', border: '1px solid var(--color-dark-border)' }}
        >
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-dark-text-muted)' }}>
            Password requirements
          </p>
          <ul className="space-y-1.5">
            {requirements.map(({ label, met }) => (
              <li key={label} className="flex items-center gap-2 text-sm">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200"
                  style={{ background: met ? 'var(--color-brand-green)' : 'var(--color-dark-border)' }}
                />
                <span style={{ color: met ? 'var(--color-dark-text-primary)' : 'var(--color-dark-text-placeholder)' }}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
 
        {errors.submit && <ErrorBanner message={errors.submit} />}
 
        <AuthButton loading={isSettingPassword} onClick={handleSubmit}>
          {hasPassword ? "Reset Password" : "Set Password"}
        </AuthButton>
      </div>
    </AuthLayout>
  );
};

export default PasswordSetupPage;