import adminPic from '../../../../Assets/admin-pic.png';
import './Header.css'
function Header() {
  return (
    <div className="header">
      <div className="header-bar">
        <p>Welcome back, <span>"School name"</span></p>
        <div className="header-img-wrapper">
          <img src={adminPic} alt="admin" className="header-img" />
        </div>
      </div>
      <div className="header-line"></div>
    </div>
  );
}

export default Header;