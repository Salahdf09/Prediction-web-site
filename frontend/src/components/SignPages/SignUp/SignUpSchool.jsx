import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpSchool } from "../../../api/api";
import "./SignUpSchool.css";
import schoolImg from "../../../assets/images/School.png";
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

export default function SignUpSchool() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    schoolName: "", email: "", address: "",
    school_code: "",
    password: "", confirmPassword: "",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.schoolName || !form.email || !form.address || !form.school_code || !form.password) {
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
      await signUpSchool({
        name:        form.schoolName,
        address:     form.address,
        email:       form.email,
        school_code: form.school_code,
        password:    form.password,
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Failed to create school account");
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
          {success && <p style={{ color: "green", marginBottom: "8px" }}>Account created! Redirecting to login...</p>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group full-width">
              <label>School Name</label>
              <input type="text" name="schoolName" placeholder="Enter school name"
                value={form.schoolName} onChange={handleChange} required />
            </div>

            <div className="form-group full-width">
              <label>E-mail</label>
              <input type="email" name="email" placeholder="example@gmail.com"
                value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <input type="text" name="address" placeholder="Enter the address"
                value={form.address} onChange={handleChange} required />
            </div>

            <div className="form-group full-width">
              <label>School ID</label>
              <input type="text" name="school_code" placeholder="Enter school ID"
                value={form.school_code} onChange={handleChange} required />
            </div>

            <div className="form-group password-field">
              <label>Password</label>
              <input type="password" name="password" placeholder="xxxxxxxxxx"
                value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group password-field">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="xxxxxxxxxx"
                value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <div className="submit-row">
              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </div>
          </form>
        </div>
        <div className="signup-illustration school-illustration">
          <img src={schoolImg} alt="School illustration" />
        </div>
      </div>
    </div>
  );
}