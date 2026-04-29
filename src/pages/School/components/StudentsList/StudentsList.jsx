import { useState } from 'react';
import deleteIcon from '../../../../Assets/delete.png';
import editIcon from '../../../../Assets/modify.png';
import './StudentsList.css';

const initialStudents = [
  { id: '01', name: 'Chaa Youssra',     dob: '02/04/2006', phone: '+213 699576680' },
  { id: '20', name: 'Zerroug Maram',    dob: '02/07/2007', phone: '+213 699576680' },
  { id: '50', name: 'Abdelli Chiraz',   dob: '06/06/2009', phone: '+213 699576680' },
  { id: '35', name: 'Aidouni Atef',     dob: '05/10/2008', phone: '+213 699576680' },
  { id: '35', name: 'Sahel Moussa',     dob: '03/07/2007', phone: '+213 699576680' },
  { id: '35', name: 'Berkani Takwa',    dob: '03/10/2004', phone: '+213 699576680' },
  { id: '35', name: 'Aiboud Ichrek',    dob: '02/07/2007', phone: '+213 699576680' },
  { id: '35', name: 'Guerrara Fatima',  dob: '02/07/2007', phone: '+213 699576680' },
];

const emptyForm = {
  name: '', id: '', dob: '', phone: '',
  t1: '', t2: '', t3: '',
};

function StudentsList() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [students, setStudents] = useState(initialStudents);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.includes(search)
  );

  const toggleSelect = (name) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = () => {
    if (!form.name || !form.id) return;
    setStudents(prev => [...prev, {
      id: form.id, name: form.name,
      dob: form.dob, phone: form.phone,
    }]);
    setForm(emptyForm);
    setShowModal(false);
  };

  const handleExport = () => {
    const rows = filtered.map(s =>
      `${s.name},${s.id},${s.dob},${s.phone}`
    ).join('\n');
    const csv = `Name,ID,Date of Birth,Phone\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="students-page">

      {/* Page header */}
      <div className="students-page-header">
        <h2 className="students-title">Students List</h2>
        <div className="header-btns">
          <button className="btn-export" onClick={handleExport}>
            Export CSV/PDF <span>+</span>
          </button>
          <button className="add-student-btn" onClick={() => setShowModal(true)}>
            Add Student <span>+</span>
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="students-card">
        <div className="students-card-header">
          <span className="students-card-title">Students Information</span>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by Name or ID"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Desktop table */}
        <table className="students-table">
          <thead>
            <tr>
              <th></th>
              <th>Students Name</th>
              <th>ID</th>
              <th>Date of birth</th>
              <th>Parent's phone number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student, i) => (
              <tr key={i} className={selected.includes(student.name) ? 'selected-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(student.name)}
                    onChange={() => toggleSelect(student.name)}
                  />
                </td>
                <td>
                  <div className="student-name-cell">
                    <div className="student-avatar" />
                    <span>{student.name}</span>
                  </div>
                </td>
                <td className="student-id">#{student.id}</td>
                <td>{student.dob}</td>
                <td>{student.phone}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-delete" title="Delete">
                      <img src={deleteIcon} alt="delete" />
                    </button>
                    <button className="btn-edit" title="Edit">
                      <img src={editIcon} alt="edit" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 👇 Mobile cards — inside students-card */}
        <div className="mobile-student-cards">
          {filtered.map((student, i) => (
            <div className="mobile-student-card" key={i}>
              <div className="mobile-card-top">
                <div className="mobile-card-left">
                  <div className="mobile-card-avatar" />
                  <div>
                    <p className="mobile-card-name">{student.name}</p>
                    <span className="mobile-card-id">#{student.id}</span>
                  </div>
                </div>
                <div className="mobile-card-actions">
                  <button className="btn-edit">
                    <img src={editIcon} alt="edit" />
                  </button>
                  <button className="btn-delete">
                    <img src={deleteIcon} alt="delete" />
                  </button>
                </div>
              </div>
              <div className="mobile-card-bottom">
                <div className="mobile-card-info">
                  <span className="mobile-info-label">Date of birth</span>
                  <span className="mobile-info-value">{student.dob}</span>
                </div>
                <div className="mobile-card-info">
                  <span className="mobile-info-label">Parent's phone</span>
                  <span className="mobile-info-value">📞 {student.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div> {/* 👈 students-card closes here */}

      {/* Add Student Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Student</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-section-title">Student Information</p>
              <div className="modal-grid">
                <div className="modal-field">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Chaa Youssra" />
                </div>
                <div className="modal-field">
                  <label>Student ID</label>
                  <input name="id" value={form.id} onChange={handleChange} placeholder="e.g. 01" />
                </div>
                <div className="modal-field">
                  <label>Date of Birth</label>
                  <input name="dob" value={form.dob} onChange={handleChange} placeholder="DD/MM/YYYY" />
                </div>
                <div className="modal-field">
                  <label>Parent's Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+213 6XXXXXXXX" />
                </div>
              </div>
              <p className="modal-section-title">Trimester Scores</p>
              <div className="modal-grid three-col">
                <div className="modal-field">
                  <label>Trimester 1</label>
                  <input name="t1" value={form.t1} onChange={handleChange} placeholder="e.g. 14.5" />
                </div>
                <div className="modal-field">
                  <label>Trimester 2</label>
                  <input name="t2" value={form.t2} onChange={handleChange} placeholder="e.g. 15.0" />
                </div>
                <div className="modal-field">
                  <label>Trimester 3</label>
                  <input name="t3" value={form.t3} onChange={handleChange} placeholder="e.g. 16.0" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel-modal" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={handleAdd}>Add Student</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentsList;