import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
  onCancel: () => void;
  message?: string;
}

export function LoginPage({ onSuccess, onCancel, message }: LoginPageProps) {
  const { login, isLoading } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const errors: { usernameOrEmail?: string; password?: string } = {};

    if (!usernameOrEmail.trim()) {
      errors.usernameOrEmail = 'Username or AAU email address is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) {
      return;
    }

    const res = await login({
      usernameOrEmail: usernameOrEmail.trim(),
      password,
    });

    if (res.success) {
      onSuccess();
    } else {
      setAuthError(res.message || 'Login failed. Please verify your credentials.');
    }
  };

  return (
    <div className="login-page-container" data-testid="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-badge" aria-hidden="true">
            AAU
          </div>
          <h1 className="login-title">Sign In to AAU Campus Market</h1>
          <p className="login-subtitle">
            Access your university student account, checkout cart, and orders
          </p>
        </div>

        {message && (
          <div className="login-notice-banner" role="status">
            ℹ️ {message}
          </div>
        )}

        {authError && (
          <div className="login-error-banner" role="alert" data-testid="login-error-banner">
            ⚠️ {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="username-input" className="form-label">
              Username or AAU Email
            </label>
            <input
              id="username-input"
              type="text"
              autoComplete="username"
              className={`form-input ${fieldErrors.usernameOrEmail ? 'input-error' : ''}`}
              placeholder="e.g. abebe_b or student@aau.edu.et"
              value={usernameOrEmail}
              disabled={isLoading}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
                if (fieldErrors.usernameOrEmail) {
                  setFieldErrors((prev) => ({ ...prev, usernameOrEmail: undefined }));
                }
                setAuthError(null);
              }}
              aria-invalid={Boolean(fieldErrors.usernameOrEmail)}
              aria-describedby={fieldErrors.usernameOrEmail ? 'username-error' : undefined}
            />
            {fieldErrors.usernameOrEmail && (
              <span id="username-error" className="field-error-text" role="alert">
                {fieldErrors.usernameOrEmail}
              </span>
            )}
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password-input" className="form-label">
                Password
              </label>
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
              placeholder="Enter your account password"
              value={password}
              disabled={isLoading}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
                setAuthError(null);
              }}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password && (
              <span id="password-error" className="field-error-text" role="alert">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-login-submit"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            <button
              type="button"
              className="btn-login-cancel"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="login-footer-info">
          <small>
            Protected by Addis Ababa University authentication policies. Supported roles include
            student <strong>BUYER</strong>, campus store <strong>SELLER</strong>, and marketplace{' '}
            <strong>ADMIN</strong>.
          </small>
        </div>
      </div>
    </div>
  );
}
