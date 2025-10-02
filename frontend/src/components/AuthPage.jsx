// src/components/AuthPage.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './auth.css';

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setErr(e.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card modern-card glass fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">
              <span className="gradient-text">✨</span>
            </div>
            <h1 className="auth-title">
              <span className="gradient-text">SkillWise</span>
            </h1>
            <p className="auth-subtitle">Your AI Learning Journey Starts Here</p>
          </div>
        </div>
        
        <div className="auth-tabs">
          <button
            className={`tab-button ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
            disabled={busy}
          >
            <span>Sign In</span>
          </button>
          <button
            className={`tab-button ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
            disabled={busy}
          >
            <span>Create Account</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📧</span>
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
              placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"}
            />
          </div>
          
          {err && (
            <div className="error-message slide-up">
              <span className="error-icon">⚠️</span>
              {err}
            </div>
          )}
          
          <button
            type="submit"
            className={`btn-modern btn-primary w-100 ${busy ? 'loading' : ''}`}
            disabled={busy}
          >
            {busy ? (
              <>
                <div className="spinner"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="footer-text">
            {mode === "login" ? "New to SkillWise?" : "Already have an account?"}
            <button
              type="button"
              className="link-button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              disabled={busy}
            >
              {mode === "login" ? "Create an account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
