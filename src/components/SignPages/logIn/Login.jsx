import { useState } from "react";
import "./Login.css";
// Login.jsx - REPLACE all three image imports with:
import loginImg from "../../../assets/images/LoginImages/login.png";
import vectLeft from "../../../assets/images/LoginImages/vectleft.png";
import vectRight from "../../../assets/images/LoginImages/vectright.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log(form); };
  const handleGoogle = () => { console.log("Login with Google"); };

  return (
    <div className="login-page">

      {/* Top-left squiggle */}
      <img src={vectLeft} className="deco deco-left" alt="" />

      {/* Right blue blob + illustration on top */}
      <div className="deco-right-wrapper">
        <img src={vectRight} className="deco-right-blob" alt="" />
        <img src={loginImg} className="deco-right-img" alt="Login illustration" />
      </div>

      {/* Login card */}
      <div className="login-card">
        <h1 className="login-title">Log in</h1>

        {/* Google button */}
        <button className="google-btn" onClick={handleGoogle}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="google-icon"
          />
          Login with Google
        </button>

        {/* Divider */}
        <div className="divider">
          <span className="divider-line" />
          <span className="divider-text">OR</span>
          <span className="divider-line" />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" name="email" placeholder="example@gmail.com"
              value={form.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="xxxxxxxxxxx"
              value={form.password} onChange={handleChange} />
          </div>

          <div className="submit-row">
            <button type="submit" className="login-btn">Log in</button>
          </div>
        </form>

        <div className="login-footer">
          <p>Forgot your password ?</p>
          <p>Don't have an account? <a href="/signup" className="signup-link">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}