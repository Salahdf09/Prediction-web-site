import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from "../../../assets/LandingImages/logo.png";
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="navbar">
      <img className="logo" src={logo} alt="Logo" />
      <ul className="nav-links">
        <li><a href="#Hero">Home</a></li>
        <li><a href="#About">About</a></li>
        <li><a href="#Services">Services</a></li>
        <li><a href="#Feedback">Feedback</a></li>
      </ul>

      <div className="navbtns">
        <button className="btn_login" onClick={() => navigate('/login')}>
          Log in
        </button>

        <div className="signup-wrapper">
          <button
            className="btn_signup"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Sign up ▾
          </button>

   {showDropdown && (
    <div className="signup-dropdown">
    <button onClick={() => { navigate('/signup/student'); setShowDropdown(false) }}>🎒 Student</button>
    <button onClick={() => { navigate('/signup/parent');  setShowDropdown(false) }}>👨‍👩‍👧 Parent</button>
    <button onClick={() => { navigate('/signup/admin');   setShowDropdown(false) }}>🛡️ Administrator</button>
    <button onClick={() => { navigate('/signup/school');  setShowDropdown(false) }}>🏫 School</button>
    </div>
   )}
        </div>
      </div>
    </div>
  )
}

export default Navbar;