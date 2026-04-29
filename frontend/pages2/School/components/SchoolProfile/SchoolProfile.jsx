import { useState } from 'react';
import './SchoolProfile.css';
import schoolIcon from '../../../../Assets2/school-icon.png'; // ðŸ‘ˆ change to your icon

const tabs = [
  { key: 'account', label: 'Account Settings' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'password', label: 'Password & Security' },
];

function AccountSettings() {
  return (
    <div className="profile-panel">
      <div className="photo-row">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar" />
          <button className="avatar-edit-btn">âœï¸</button>
        </div>
        <div className="photo-info">
          <span className="photo-label">Upload a new photo</span>
        </div>
      </div>

      <div className="profile-form-card">
        <div className="form-grid">
          <div className="form-group">
            <label>School Name</label>
            <input type="text" placeholder="" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" placeholder="" />
          </div>
          <div className="form-group full-width">
            <label>E-mail</label>
            <input type="email" placeholder="" />
          </div>
          <div className="form-group full-width">
            <label>Address</label>
            <input type="text" placeholder="" />
          </div>
        </div>
        <div className="form-btn-row">
        <button className="btn-update">Update Information</button>
        <button className="btn-cancel">Cancel</button>
       </div>
      </div>
    </div>
  );
}

function Notifications() {
  const items = [
    {
      title: 'New Prediction Available',
      text: 'Your updated predicted score for the final exam is ready!',
      action: 'View Prediction'
    },
    {
      title: 'Great Progress! Well Done!',
      text: 'You increased your predicted score by 10% Keep up the good work!',
      action: 'View Report'
    },
    {
      title: 'System Update',
      text: 'New features have been added to improve your experience.',
      action: 'Learn More'
    },
  ];

  return (
    <div className="profile-panel">
      {items.map((n, i) => (
        <div className="notif-card" key={i}>
          <h4 className="notif-title">{n.title}</h4>
          <div className="notif-divider" />
          <p className="notif-text">{n.text}</p>
          <div className="notif-action-row">
            <button className="btn-notif-action">{n.action}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PasswordSecurity() {
  return (
    <div className="profile-panel">
      <div className="profile-form-card">
        <div className="password-header">
          <span className="lock-icon">ðŸ”’</span>
          <h3 className="form-title">Change Password</h3>
        </div>
        <p className="password-desc">
          To change your password, please fill in the fields below.
          Your password must contain at least 8 characters, it must
          also include at least one upper case letter, one lower case
          letter, one number and one special character.
        </p>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Current Password</label>
            <input type="password" placeholder="" />
          </div>
          <div className="form-group full-width">
            <label>New Password</label>
            <input type="password" placeholder="" />
          </div>
          <div className="form-group full-width">
            <label>Confirm New Password</label>
            <input type="password" placeholder="" />
          </div>
        </div>
        <div className="password-btn-row">
        <button className="btn-update">Change Password</button>
        <button className="btn-cancel">Cancel</button>
      </div>
      </div>
    </div>
  );
}

function SchoolProfile() {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    if (activeTab === 'account') return <AccountSettings />;
    if (activeTab === 'notifications') return <Notifications />;
    if (activeTab === 'password') return <PasswordSecurity />;
  };

  return (
    <div className="settings-page">

      {/* Desktop header */}
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
       
      </div>

      {/* Mobile header */}
      

      {/* Mobile tabs â€” horizontal */}
      <div className="mobile-tabs">
        {tabs.map(tab => (
          <div
            key={tab.key}
            className={`mobile-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Desktop body */}
      <div className="settings-body">
        {/* Left sidebar tabs â€” desktop only */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <div
              key={tab.key}
              className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-label">{tab.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>

    </div>
  );
}

export default SchoolProfile;