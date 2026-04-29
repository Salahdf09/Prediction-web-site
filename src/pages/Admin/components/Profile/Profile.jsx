import { useState } from 'react';
import './Profile.css';

const tabs = [
  { key: 'account', label: 'Account Setting', desc: 'Details about your personal information' },
  { key: 'notifications', label: 'Notifications', desc: 'See your latest notifications and updates' },
  { key: 'password', label: 'Password & Security', desc: 'Manage your password and account security' },
];

function AccountSettings() {
  return (
    <div className="profile-panel">
      {/* Photo upload */}
      <div className="photo-row">
        <div className="profile-avatar" />
        <span className="photo-label">Upload a new photo</span>
        <button className="btn-outline">Update</button>
      </div>

      {/* Form */}
      <div className="profile-form-card">
        <h3 className="form-title">Change User Information here</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>School name</label>
            <input type="text" placeholder="" />
          </div>
          <div className="form-group">
            <label>Phone number</label>
            <input type="text" placeholder="" />
          </div>
          <div className="form-group full-width">
            <label>E-mail</label>
            <input type="email" placeholder="" />
          </div>
          <div className="form-group full-width">
            <label>Adress</label>
            <input type="text" placeholder="" />
          </div>
        </div>
        <button className="btn-update">Update Information</button>
      </div>
    </div>
  );
}

function Notifications() {
  const items = [
    { text: 'New student registered', time: '2 min ago' },
    { text: 'Attendance report is ready', time: '1 hour ago' },
    { text: 'System update completed', time: 'Yesterday' },
  ];
  return (
    <div className="profile-panel">
      <div className="profile-form-card">
        <h3 className="form-title">Latest Notifications</h3>
        <ul className="notif-list">
          {items.map((n, i) => (
            <li key={i} className="notif-item">
              <div className="notif-dot" />
              <div>
                <p className="notif-text">{n.text}</p>
                <span className="notif-time">{n.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PasswordSecurity() {
  return (
    <div className="profile-panel">
      <div className="profile-form-card">
        <h3 className="form-title">Change Password</h3>
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
        <button className="btn-update">Update Password</button>
      </div>
    </div>
  );
}

function Profile() {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    if (activeTab === 'account') return <AccountSettings />;
    if (activeTab === 'notifications') return <Notifications />;
    if (activeTab === 'password') return <PasswordSecurity />;
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <button className="btn-cancel">Cancel</button>
      </div>

      <div className="settings-body">
        {/* Left sidebar tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <div
              key={tab.key}
              className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-label">{tab.label}</span>
              <span className="tab-desc">{tab.desc}</span>
            </div>
          ))}
        </div>

        {/* Right content */}
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Profile;