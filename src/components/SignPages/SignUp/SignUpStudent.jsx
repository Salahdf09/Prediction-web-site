import { useState } from "react";
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
 
export default function SignUpStudent() {
  const [form, setForm] = useState({
    firstName: "", familyName: "", email: "",
    studentId: "", level: "", stream: "",
    password: "", confirmPassword: "",
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
 
      {/* Mobile-only: rope squiggle top-left (hidden on desktop via CSS) */}
      <img src={vect11} className="mobile-rope" alt="" style={{ display: "none" }} />
 
      {/* Mobile-only: two wave layers at bottom (hidden on desktop via CSS) */}
      <img src={vect9}  className="mobile-wave mobile-wave-back"  alt="" style={{ display: "none" }} />
      <img src={vect10} className="mobile-wave mobile-wave-front" alt="" style={{ display: "none" }} />
 
      {/* Mobile-only: logo at bottom center (hidden on desktop via CSS) */}
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
                <input type="text" name="stream" placeholder="stream"
                  value={form.stream} onChange={handleChange} />
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
              <button type="submit" className="signup-btn">Sign up</button>
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