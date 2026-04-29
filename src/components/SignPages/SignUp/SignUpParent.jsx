import { useState } from "react";
import "./SignUpParent.css";
import parentImg from "../../../assets/images/parent.png";
import ellipseImg from "../../../assets/images/parent2.png";
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

export default function SignUpParent() {
  const [form, setForm] = useState({
    firstName: "", familyName: "", email: "",
    studentId: "", password: "", confirmPassword: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log(form); };

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

      {/* Mobile-only: rope squiggle top-left */}
      <img src={vect11} className="mobile-rope" alt="" style={{ display: "none" }} />

      {/* Mobile-only: wave layers at bottom */}
      <img src={vect9}  className="mobile-wave mobile-wave-back"  alt="" style={{ display: "none" }} />
      <img src={vect10} className="mobile-wave mobile-wave-front" alt="" style={{ display: "none" }} />

      {/* Mobile-only: logo at bottom center */}
      <div className="mobile-logo" style={{ display: "none" }}>
        <img src={logoImg} alt="Logo" />
      </div>

      <div className="signup-content">
        <div className="signup-card">
          <h1 className="signup-title">Sign up</h1>

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
              <label>Child ID</label>
              <input type="text" name="studentId" placeholder="xxxx"
                value={form.studentId} onChange={handleChange} />
            </div>

            <div className="form-group password-field">
              <label>Password</label>
              <input type="password" name="password" placeholder="xxxxxxxxxx"
                value={form.password} onChange={handleChange} />
            </div>

            <div className="form-group password-field">
              <label>Confirm password</label>
              <input type="password" name="confirmPassword" placeholder="xxxxxxxxxx"
                value={form.confirmPassword} onChange={handleChange} />
            </div>

            <div className="submit-row">
              <button type="submit" className="signup-btn">Sign up</button>
            </div>
          </form>
        </div>

        {/* Illustration */}
        <div className="parent-illustration">
          <img src={parentImg} className="illustration-main" alt="Parent illustration" />
          <img src={ellipseImg} className="illustration-ellipse" alt="" />
        </div>
      </div>
    </div>
  );
}