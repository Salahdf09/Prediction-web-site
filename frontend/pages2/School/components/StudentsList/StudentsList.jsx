import { useMemo, useState } from 'react';
import deleteIcon from '../../../../Assets2/delete.png';
import editIcon from '../../../../Assets2/modify.png';
import { createSchoolStudent } from '../../../../src/api/api';
import './StudentsList.css';

const emptyForm = {
  name: '', id: '', email: '', password: '',
  academicYear: '', stream: '', phone: '',
};

function normalizeStudent(student) {
  return {
    id: String(student.student_id ?? student.id ?? ''),
    name: student.name || student.user?.name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unnamed student',
    dob: student.academic_year ? String(student.academic_year) : '-',
    phone: student.parent_phone || '-',
  };
}

function StudentsList({ schoolId, students: apiStudents = [], onStudentCreated }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [localStudents, setLocalStudents] = useState([]);
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const students = useMemo(
    () => [...apiStudents.map(normalizeStudent), ...localStudents],
    [apiStudents, localStudents],
  );

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.includes(search)
  );

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    setModalError('');
    if (!schoolId) {
      setModalError('School session not found. Please log in again.');
      return;
    }
    if (!form.name || !form.id || !form.email || !form.password) {
      setModalError('Name, ID, email, and password are required.');
      return;
    }
    if (form.password.length < 6) {
      setModalError('Password must be at least 6 characters.');
      return;
    }

    setModalLoading(true);
    try {
      const created = await createSchoolStudent(schoolId, {
        name: form.name,
        id: form.id,
        email: form.email,
        password: form.password,
        academicYear: form.academicYear,
        stream: form.stream,
      });
      if (onStudentCreated) {
        await onStudentCreated();
      } else {
        setLocalStudents(prev => [...prev, normalizeStudent({ ...created, parent_phone: form.phone || created.parent_phone })]);
      }
      setForm(emptyForm);
      setShowModal(false);
    } catch (err) {
      setModalError(err.message || 'Failed to add student.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleExport = () => {
    const rows = filtered.map(s =>
      `${s.name},${s.id},${s.dob},${s.phone}`
    ).join('\n');
    const csv = `Name,ID,Academic Year,Phone\n${rows}`;
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
            <span className="search-icon">Search</span>
          </div>
        </div>

        <table className="students-table">
          <thead>
            <tr>
              <th></th>
              <th>Students Name</th>
              <th>ID</th>
              <th>Academic year</th>
              <th>Parent phone number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id || student.name} className={selected.includes(student.id) ? 'selected-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(student.id)}
                    onChange={() => toggleSelect(student.id)}
                  />
                </td>
                <td>
                  <div className="student-name-cell">
                    <div className="student-avatar" />
                    <span>{student.name}</span>
                  </div>
                </td>
                <td className="student-id">#{student.id || '-'}</td>
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mobile-student-cards">
          {filtered.map((student) => (
            <div className="mobile-student-card" key={student.id || student.name}>
              <div className="mobile-card-top">
                <div className="mobile-card-left">
                  <div className="mobile-card-avatar" />
                  <div>
                    <p className="mobile-card-name">{student.name}</p>
                    <span className="mobile-card-id">#{student.id || '-'}</span>
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
                  <span className="mobile-info-label">Academic year</span>
                  <span className="mobile-info-value">{student.dob}</span>
                </div>
                <div className="mobile-card-info">
                  <span className="mobile-info-label">Parent phone</span>
                  <span className="mobile-info-value">{student.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Student</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>x</button>
            </div>
            <div className="modal-body">
              {modalError && <p className="modal-error">{modalError}</p>}
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
                  <label>E-mail</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@example.com" />
                </div>
                <div className="modal-field">
                  <label>Temporary Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimum 6 characters" />
                </div>
              </div>
              <p className="modal-section-title">Academic Details</p>
              <div className="modal-grid three-col">
                <div className="modal-field">
                  <label>Academic Year</label>
                  <input name="academicYear" value={form.academicYear} onChange={handleChange} placeholder="2026" />
                </div>
                <div className="modal-field">
                  <label>Stream</label>
                  <input name="stream" value={form.stream} onChange={handleChange} placeholder="Science" />
                </div>
                <div className="modal-field">
                  <label>Parent Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+213 6XXXXXXXX" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel-modal" onClick={() => setShowModal(false)} disabled={modalLoading}>Cancel</button>
              <button className="btn-confirm" onClick={handleAdd} disabled={modalLoading}>
                {modalLoading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsList;
