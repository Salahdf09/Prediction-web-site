import './Header.css';
import schoolIcon from '../../../../Assets/school-icon.png';
import { useNavigate } from 'react-router-dom';
import notifIcon from '../../../../Assets/notification.png';
import logoutIcon from '../../../../Assets/logout_icon.png';


function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">

      {/* 👇 Mobile top bar — notification + logo + logout */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-left">
            <div className="notif-icon">
              <img src={notifIcon} alt="notification" />
          </div>
          <div className="logout-icon" onClick={() => navigate('/')}>
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