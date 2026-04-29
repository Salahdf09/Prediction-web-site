import './UserManagement.css';
import deleteIcon from '../../../../Assets/delete.png';
import editIcon from '../../../../Assets/modify.png';
import { useState } from 'react';


const data = {
  Students: [
    { id: '01', name: 'Chaa Youssra',    phone: '+213 699576680' },
    { id: '20', name: 'Zerroug Maram',   phone: '+213 699576680' },
    { id: '50', name: 'Abdelli Chiraz',  phone: '+213 699576680' },
    { id: '35', name: 'Aidouni Atef',    phone: '+213 699576680' },
    { id: '35', name: 'Sahel Moussa',    phone: '+213 699576680' },
    { id: '35', name: 'Berkani Takwa',   phone: '+213 699576680' },
    { id: '35', name: 'Aiboud Ichrek',   phone: '+213 699576680' },
    { id: '35', name: 'Guerrara Fatima', phone: '+213 699576680' },
  ],
  Parents: [
    { id: '01', name: 'Chaa Youssra',    phone: '+213 699576680' },
    { id: '20', name: 'Zerroug Maram',   phone: '+213 699576680' },
    { id: '50', name: 'Abdelli Chiraz',  phone: '+213 699576680' },
    { id: '35', name: 'Aidouni Atef',    phone: '+213 699576680' },
    { id: '35', name: 'Sahel Moussa',    phone: '+213 699576680' },
    { id: '35', name: 'Berkani Takwa',   phone: '+213 699576680' },
    { id: '35', name: 'Aiboud Ichrek',   phone: '+213 699576680' },
    { id: '35', name: 'Guerrara Fatima', phone: '+213 699576680' },
  ],
  Schools: [
    { id: '01', name: 'Ecole Ibn Sina',      phone: '+213 699576680' },
    { id: '02', name: 'Ecole El Amel',       phone: '+213 699576680' },
    { id: '03', name: 'Ecole El Nour',       phone: '+213 699576680' },
    { id: '04', name: 'Ecole El Wiam',       phone: '+213 699576680' },
    { id: '05', name: 'Ecole El Fath',       phone: '+213 699576680' },
    { id: '06', name: 'Ecole El Rahma',      phone: '+213 699576680' },
    { id: '07', name: 'Ecole El Baraka',     phone: '+213 699576680' },
    { id: '08', name: 'Ecole El Mokhtar',    phone: '+213 699576680' },
  ],
};

const columns = {
  Students: ['Students Name', 'Student ID',  'Phone number'],
  Parents:  ['Parents Name',  'Child ID',    'Phone number'],
  Schools:  ['School Name',   'School ID',   'Phone number'],
};

const tabs = ['Students', 'Parents', 'Schools'];

function UserManagement() {
  const [activeTab, setActiveTab] = useState('Parents');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const rows = data[activeTab].filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.id.includes(search)
  );

  const toggleSelect = (name) =>
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );

  const cols = columns[activeTab];

  return (
    <div className="um-page">
      {/* Tab bar + search */}
      <div className="um-topbar">
        <div className="um-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`um-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setSelected([]); }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="um-search">
          <span className="um-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table card */}
      <div className="um-card">
        <table className="um-table">
          <thead>
            <tr>
              <th></th>
              <th>{cols[0]}</th>
              <th>{cols[1]}</th>
              <th>{cols[2]}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={selected.includes(row.name) ? 'um-selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(row.name)}
                    onChange={() => toggleSelect(row.name)}
                  />
                </td>
                <td>
                  <div className="um-name-cell">
                    <div className="um-avatar" />
                    <span>{row.name}</span>
                  </div>
                </td>
                <td className="um-id">#{row.id}</td>
                <td>{row.phone}</td>
                <td>
                  <div className="um-actions">
                    <button className="um-btn-delete" title="Delete">
                      <img src={deleteIcon} alt="delete" />
                    </button>
                    <button className="um-btn-edit" title="Edit">
                      <img src={editIcon} alt="edit" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;