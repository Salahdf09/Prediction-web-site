import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/api";
import { saveToken } from "../../../api/auth";
import "./Login.css";
import loginImg  from "../../../assets/images/LoginImages/login.png";
import vectLeft  from "../../../assets/images/LoginImages/vectleft.png";
import vectRight from "../../../assets/images/LoginImages/vectright.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ── Helpers ───────────────────────────────────────────────────────────────────
const isValidEmailFormat = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const INVALID_CREDENTIALS = "Invalid credentials";

// ─────────────────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();

  const [form, setForm]               = useState({ email: "", code: "", password: "" });
  const [globalError, setGlobalError] = useState("");
  const [hasError, setHasError]       = useState(false);
  const [loading, setLoading]         = useState(false);

  // Forgot password
  const [forgotStep, setForgotStep]           = useState(0);
  const [forgotEmail, setForgotEmail]         = useState("");
  const [forgotOtp, setForgotOtp]             = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotError, setForgotError]         = useState("");
  const [forgotLoading, setForgotLoading]     = useState(false);
  const [forgotSuccess, setForgotSuccess]     = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setGlobalError("");
    setHasError(false);
  };

  // ── Submit ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setGlobalError("Invalid email address or password try again.");
      setHasError(true);
      return;
    }

    if (!isValidEmailFormat(form.email)) {
      setGlobalError("Invalid email address or password or id try again.");
      setHasError(true);
      return;
    }

    setLoading(true);
    setGlobalError("");
    setHasError(false);

    try {
      const data = await login(form.email.trim(), form.password);
      saveToken(data.access_token, data.role, data.user_id);
      switch (data.role) {
        case "student": navigate("/student/dashboard"); break;
        case "parent":  navigate("/parent/dashboard");  break;
        case "school":  navigate("/school");  break;
        case "admin":   navigate("/admin");   break;
        default:        navigate("/");
      }
    } catch (err) {
      setGlobalError("Invalid email address or password try again.");
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot step 1 ─────────────────────────────────────
  const handleSendOtp = async () => {
    setForgotError("");
    if (!forgotEmail)                     { setForgotError("Please enter your email."); return; }
    if (!isValidEmailFormat(forgotEmail)) { setForgotError("Please enter a valid email address."); return; }
    setForgotLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      setForgotStep(2);
      setForgotSuccess("A code has been sent to your email.");
    } catch (err) { setForgotError(err.message); }
    finally { setForgotLoading(false); }
  };

  // ── Forgot step 2 ─────────────────────────────────────
  const handleVerifyOtp = async () => {
    setForgotError("");
    if (!forgotOtp) { setForgotError("Please enter the code."); return; }
    setForgotLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code: forgotOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid code");
      setForgotStep(3); setForgotSuccess("");
    } catch (err) { setForgotError(err.message); }
    finally { setForgotLoading(false); }
  };

  // ── Forgot step 3 ─────────────────────────────────────
  const handleResetPassword = async () => {
    setForgotError("");
    if (!newPassword || !confirmPassword) { setForgotError("Please fill in both fields."); return; }
    if (newPassword !== confirmPassword)  { setForgotError("Passwords do not match."); return; }
    if (newPassword.length < 6)           { setForgotError("Password must be at least 6 characters."); return; }
    setForgotLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code: forgotOtp, new_password: newPassword, confirm_password: confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Reset failed");
      setForgotSuccess("Password reset successfully! You can now log in.");
      setTimeout(() => {
        setForgotStep(0); setForgotEmail(""); setForgotOtp("");
        setNewPassword(""); setConfirmPassword(""); setForgotSuccess("");
      }, 2000);
    } catch (err) { setForgotError(err.message); }
    finally { setForgotLoading(false); }
  };

  // ── Forgot password screens ───────────────────────────
  if (forgotStep > 0) {
    return (
      <div className="login-page">
        <img src={vectLeft} className="deco deco-left" alt="" />
        <div className="deco-right-wrapper">
          <img src={vectRight} className="deco-right-blob" alt="" />
          <img src={loginImg}  className="deco-right-img" alt="" />
        </div>
        <div className="login-card">
          <h1 className="login-title">
            {forgotStep === 1 && "Forgot Password"}
            {forgotStep === 2 && "Enter Code"}
            {forgotStep === 3 && "New Password"}
          </h1>
          {forgotError   && <p className="error-message">{forgotError}</p>}
          {forgotSuccess && <p className="success-message">{forgotSuccess}</p>}

          {forgotStep === 1 && (
            <div className="login-form">
              <div className={`form-group ${forgotError ? "field-error" : ""}`}>
                <label>E-mail</label>
                <input type="email" placeholder="example@gmail.com"
                  value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              </div>
              <div className="submit-row">
                <button className="login-btn" onClick={handleSendOtp} disabled={forgotLoading}>
                  {forgotLoading ? "Sending..." : "Send Code"}
                </button>
              </div>
            </div>
          )}
          {forgotStep === 2 && (
            <div className="login-form">
              <div className={`form-group ${forgotError ? "field-error" : ""}`}>
                <label>Verification Code</label>
                <input type="text" placeholder="Enter the 6-digit code"
                  value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} />
              </div>
              <div className="submit-row">
                <button className="login-btn" onClick={handleVerifyOtp} disabled={forgotLoading}>
                  {forgotLoading ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            </div>
          )}
          {forgotStep === 3 && (
            <div className="login-form">
              <div className={`form-group ${forgotError ? "field-error" : ""}`}>
                <label>New Password</label>
                <input type="password" placeholder="Enter new password"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className={`form-group ${forgotError ? "field-error" : ""}`}>
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm new password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="submit-row">
                <button className="login-btn" onClick={handleResetPassword} disabled={forgotLoading}>
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </div>
          )}
          <div className="login-footer">
            <p>
              <span className="back-to-login"
                onClick={() => { setForgotStep(0); setForgotError(""); setForgotSuccess(""); }}>
                ← Back to Login
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main login screen ─────────────────────────────────
  return (
    <div className="login-page">
      <img src={vectLeft} className="deco deco-left" alt="" />
      <div className="deco-right-wrapper">
        <img src={vectRight} className="deco-right-blob" alt="" />
        <img src={loginImg}  className="deco-right-img" alt="Login illustration" />
      </div>

      <div className="login-card">
        <h1 className="login-title">Log in</h1>

        <form onSubmit={handleSubmit} className="login-form" noValidate>

          {/* ── E-mail ── */}
          <div className={`form-group ${hasError ? "field-error" : ""}`}>
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* ── ID / Code ── */}
          <div className={`form-group ${hasError ? "field-error" : ""}`}>
            <label>ID / Code</label>
            <input
              type="text"
              name="code"
              placeholder="Enter your ID or code"
              value={form.code}
              onChange={handleChange}
            />
          </div>

          {/* ── Password ── */}
          <div className={`form-group ${hasError ? "field-error" : ""}`}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="xxxxxxxxxxx"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* ── Global error message ── */}
          {globalError && (
            <p className="global-error-message">{globalError}</p>
          )}

          <div className="submit-row">
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>
            <span className="forgot-link" onClick={() => { setForgotStep(1); setGlobalError(""); setHasError(false); }}>
              Forgot your password?
            </span>
          </p>
          <p>Don't have an account? <a href="/signup-choice" className="signup-link">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}
