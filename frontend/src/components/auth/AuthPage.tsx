
import { useState } from 'react';
import { apiRequest } from '../../services/api';

interface AuthPageProps {
  onLogin: (
    token: string,
    user: { id: number; full_name: string; email: string }
  ) => void;
}

function AuthPage({ onLogin }: AuthPageProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
          }),
        });
      }

      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

onLogin(data.access_token, data.user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <section className="auth-showcase">
        <div className="auth-brand">
          <div className="brand-icon">T</div>
          <span>TeamFlow</span>
        </div>

        <div className="showcase-content">
          <span className="showcase-tag">
            YOUR WORKSPACE, SIMPLIFIED
          </span>

          <h1>
            Work smarter.
            <br />
            Achieve more.
          </h1>

          <p>
            Bring your projects, tasks, and team together
            in one organized workspace. Stay focused,
            collaborate, and make progress every day.
          </p>

          <div className="showcase-visual">
            <div className="visual-top">
              <div>
                <span className="visual-label">WORKSPACE OVERVIEW</span>
                <h3>Project Progress</h3>
              </div>
              <span className="visual-status">● Active</span>
            </div>

            <div className="visual-stat">
              <strong>78%</strong>
              <span>Overall progress</span>
            </div>

            <div className="visual-progress">
              <div />
            </div>

            <div className="visual-bottom">
              <div>
                <span className="visual-dot purple-dot" />
                Projects
              </div>
              <div>
                <span className="visual-dot blue-dot" />
                Tasks
              </div>
              <div>
                <span className="visual-dot green-dot" />
                Team
              </div>
            </div>
          </div>
        </div>

        <p className="showcase-footer">
          © 2026 TeamFlow. All rights reserved.
        </p>
      </section>

      <section className="auth-form-section">
        <div className="auth-card">

          <span className="form-eyebrow">
            {isRegister ? 'GET STARTED' : 'WELCOME BACK'}
          </span>

          <h2>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>

          <p className="auth-description">
            {isRegister
              ? 'Create an account to get started with TeamFlow.'
              : 'Sign in to continue to your workspace.'}
          </p>

          <form onSubmit={handleSubmit}>

            {isRegister && (
              <label>
                Full Name
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </label>
            )}

            <label>
              Email Address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                minLength={8}
                required
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading
                ? 'Please wait...'
                : isRegister
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            {isRegister
              ? 'Already have an account?'
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}

export default AuthPage;
