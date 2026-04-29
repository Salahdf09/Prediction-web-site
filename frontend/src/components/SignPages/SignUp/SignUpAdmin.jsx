import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpAdmin } from "../../../api/api";
import "./SignUpAdmin.css";
import adminImg from "../../../assets/images/administration.png";
import logoImg from "../../../assets/images/logo.png";
import vect1 from "../../../assets/images/SignUpImages/vect1.png";
import vect2 from "../../../assets/images/SignUpImages/vect2.png";
import vect3 from "../../../assets/images/SignUpImages/vect3.png";
import vect4 from "../../../assets/images/SignUpImages/vect4.png";
import vect5 from "../../../assets/images/SignUpImages/vect5.png";
import vect6 from "../../../assets/images/SignUpImages/vect6.png";
import vect7 from "../../../assets/images/SignUpImages/vect7.png";
import vect8 from "../../../assets/images/SignUpImages/vect8.png";
import vect9 from "../../../assets/images/vect9.png";
import vect10 from "../../../assets/images/Vect10.png";
import vect11 from "../../../assets/images/Vector 11 (2).png";

export default function SignUpAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", phoneNumber: "",
    code: "", password: "", confirmPassword: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.code || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUpAdmin({
        username:   form.fullName,
        email:      form.email,
        admin_code: form.code,        // FIXED
        password:   form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <img src={vect2} className="deco vect2" alt="" />
      <img src={vect1} className="deco vect1" alt="" />
      <img src={vect4} className="deco vect4" alt="" />
      <img src={vect3} className="deco vect3" alt="" />
      <img src={vect5} className="deco vect5" alt="" />
      <img src={vect7} className="deco vect7" alt="" />
      <img src={vect6} className="deco vect6" alt="" />
      <img src={vect8} className="deco vect8" alt="" />
      <img src={vect11} className="mobile-rope" alt="" style={{ display: "none" }} />
      <img src={vect9}  className="mobile-wave mobile-wave-back"  alt="" style={{ display: "none" }} />
      <img src={vect10} className="mobile-wave mobile-wave-front" alt="" style={{ display: "none" }} />
      <div className="mobile-logo" style={{ display: "none" }}>
        <img src={logoImg} alt="Logo" />
      </div>

      <div className="signup-content">
        <div className="signup-card">
          <h1 className="signup-title">Sign up</h1>

          {error && <p style={{ color: "red", marginBottom: "8px" }}>{error}</p>}

          <form onSubmit={handleSubmit} className="signup-form">

            <div className="form-group full-width">
              <label>Full name</label>
              <input type="text" name="fullName" placeholder="Enter full name"
                value={form.fullName} onChange={handleChange} required />
            </div>

            <div className="form-group full-width">
              <label>E-mail</label>
              <input type="email" name="email" placeholder="example@gmail.com"
                value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group full-width">
              <label>Phone Number</label>
              <input type="tel" name="phoneNumber" placeholder="Enter the phone number"
                value={form.phoneNumber} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label>Code</label>
              <input type="text" name="code" placeholder="Enter code"
                value={form.code} onChange={handleChange} required />
            </div>

            <div className="form-group password-field">
              <label>Password</label>
              <input type="password" name="password" placeholder="xxxxxxxxxx"
                value={form.password} onChange={handleChange} required />
            </div>

            <div className="form-group password-field">
              <label>Confirm password</label>
              <input type="password" name="confirmPassword" placeholder="xxxxxxxxxx"
                value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="submit-row">
              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>
        </div>

        <div className="signup-illustration admin-illustration">
          <img src={adminImg} alt="Administration illustration" />
        </div>
      </div>
    </div>
  );
}