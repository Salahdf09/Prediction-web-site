import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpStudent.css";
import studentImg from "../../../assets/images/student-signup.png";
import logoImg from "../../../assets/images/logo.png";
import vect11 from "../../../assets/images/Vector 11 (2).png";
import vect1 from "../../../assets/images/SignUpImages/vect1.png";
import vect2 from "../../../assets/images/SignUpImages/vect2.png";
import vect3 from "../../../assets/images/SignUpImages/vect3.png";
import vect4 from "../../../assets/images/SignUpImages/vect4.png";
import vect5 from "../../../assets/images/SignUpImages/vect5.png";
import vect6 from "../../../assets/images/SignUpImages/vect6.png";
import vect7 from "../../../assets/images/SignUpImages/vect7.png";
import vect8 from "../../../assets/images/SignUpImages/vect8.png";
import vect9 from "../../../assets/images/vect9.png";
import vect10 from "../../../assets/images/vect10.png";

import { signUpStudent } from "../../../api/api";

export default function SignUpStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", familyName: "", email: "",
    studentId: "", schoolName: "", level: "", stream: "",
    password: "", confirmPassword: "",
  });

  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── Client-side validation ──────────────────────────
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    // ───────────────────────────────────────────────────

    setLoading(true);
    try {
      await signUpStudent({
        firstName: form.firstName,
        familyName: form.familyName,
        email: form.email,
        studentPersonalId: form.studentId,
        schoolName: form.schoolName,
        level: form.level,
        stream: form.stream,
        password: form.password,
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500); // redirect to login after success

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* Desktop decorations */}
      <img src={vect2} className="deco vect2" alt="" />
      <img src={vect1} className="deco vect1" alt="" />
      <img src={vect4} className="deco vect4" alt="" />
      <img src={vect3} className="deco vect3" alt="" />
      <img src={vect5} className="deco vect5" alt="" />
      <img src={vect7} className="deco vect7" alt="" />
      <img src={vect6} className="deco vect6" alt="" />
      <img src={vect8} className="deco vect8" alt="" />

      {/* Mobile-only decorations */}
      <img src={vect11} className="mobile-rope" alt="" style={{ display: "none" }} />
      <img src={vect9}  className="mobile-wave mobile-wave-back"  alt="" style={{ display: "none" }} />
      <img src={vect10} className="mobile-wave mobile-wave-front" alt="" style={{ display: "none" }} />
      <div className="mobile-logo" style={{ display: "none" }}>
        <img src={logoImg} alt="Logo" />
      </div>

      <div className="signup-content">
        <div className="signup-card">
          <h1 className="signup-title">Sign up</h1>

          {/* ── Feedback messages ── */}
          {error   && <p style={{ color: "red",   marginBottom: 8 }}>{error}</p>}
          {success && <p style={{ color: "green", marginBottom: 8 }}>Account created! Redirecting…</p>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label>First name</label>
                <input type="text" name="firstName" placeholder="enter your first name"
                  value={form.firstName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Family name</label>
                <input type="text" name="familyName" placeholder="enter your family name"
                  value={form.familyName} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group full-width">
              <label>E-mail</label>
              <input type="email" name="email" placeholder="example@gmail.com"
                value={form.email} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label>School Name</label>
              <input type="text" name="schoolName" placeholder="enter your school name"
                value={form.schoolName} onChange={handleChange} />
            </div>

            <div className="form-row three-col">
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" name="studentId" placeholder="xxxx"
                  value={form.studentId} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Level</label>
                <input type="text" name="level" placeholder="level"
                  value={form.level} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Stream</label>
                <select name="stream" value={form.stream} onChange={handleChange}>
                  <option value="">stream</option>
                  <option value="5ème">5ème</option>
                  <option value="BEM">BEM</option>
                  <option value="BAC">BAC</option>
                </select>
              </div>
            </div>

            <div className="form-group password-field">
              <label>Password</label>
              <input type="password" name="password" placeholder="xxxxxxxxxxx"
                value={form.password} onChange={handleChange} />
            </div>

            <div className="form-group password-field">
              <label>Confirm password</label>
              <input type="password" name="confirmPassword" placeholder="xxxxxxxxxxx"
                value={form.confirmPassword} onChange={handleChange} />
            </div>

            <div className="submit-row">
              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? "Signing up…" : "Sign up"}
              </button>
            </div>
          </form>
        </div>

        <div className="signup-illustration student-illustration">
          <img src={studentImg} alt="Student studying" />
        </div>
      </div>
    </div>
  );
}