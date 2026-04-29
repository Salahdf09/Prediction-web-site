import './Header.css';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../src/api/auth';
import schoolIcon from '../../../../Assets2/school-icon.png';
import notifIcon from '../../../../Assets2/notification.png';
import logoutIcon from '../../../../Assets2/logout_icon.png';


function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">

      {/* ðŸ‘‡ Mobile top bar â€” notification + logo + logout */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-left">
            <div className="notif-icon">
              <img src={notifIcon} alt="notification" />
          </div>
          <div className="logout-icon" onClick={() => { logout(); navigate('/'); }}>
              <img src={logoutIcon} alt="logout" />
        </div>
     </div>
       
      </div>

      {/* Header bar */}
      <div className="header-bar">
        <div className="header-bar-text">
          <p className="header-title">Welcome back, <span>"School name"</span></p>
        </div>
        <div className="header-icon-wrapper">
          <img src={schoolIcon} alt="school" className="header-icon" />
        </div>
      </div>

      <div className="header-line"></div>
    </div>
  );
}

export default Header;