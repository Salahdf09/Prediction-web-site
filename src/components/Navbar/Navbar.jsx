import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from '../../Assets/Logo.png';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="navbar">
      <img src={logo} alt="Logo" className="logo" />

      {/* Desktop links */}
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#feedback">Feedback</a></li>
      </ul>

      {/* Desktop buttons */}
      <div className="navbtns">
        <button className="btn_login">Log in</button>
        <button className="btn_signup"  onClick={() => navigate('/signup')}>Sign up</button>
      </div>

      {/* Hamburger icon — only shows on small screens */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Mobile menu — shows when hamburger is clicked */}
     {menuOpen && (
        <div className="mobile-menu">
          <ul>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
            <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
            <li><a href="#feedback" onClick={() => setMenuOpen(false)}>Feedback</a></li>
        </ul>
        <div className="mobile-menu-divider"></div> {/* 👈 divider line */}
          <div className="mobile-btns">
            <button className="btn_login">Log in</button>
            <button className="btn_signup" onClick={() => { navigate('/signup'); setMenuOpen(false); }}>Sign up</button>
         </div>
       </div>
      )}
       </div>
   );
}

export default Navbar;