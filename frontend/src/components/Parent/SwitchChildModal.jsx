import { useState } from "react";
import "./SwitchChildModal.css";

export default function SwitchChildModal({ linkedChildren, currentId, onSelect, onAddChild, onClose }) {
  const [view, setView] = useState(linkedChildren.length > 1 ? "list" : "add");
  const [form, setForm] = useState({ fullName: "", studentId: "", email: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleAdd = () => {
    if (!form.fullName.trim() || !form.studentId.trim() || !form.email.trim()) {
      setError("Please fill in all fields");
      return;
    }
    const result = onAddChild(form);
    if (result === "not_found")     { setError("No student found with this Student ID"); return; }
    if (result === "already_added") { setError("This child is already linked"); return; }
    if (result === "mismatch")      { setError("Information does not match the student's registered data"); return; }
    setView("list");
  };

  if (view === "add") {
    return (
      <div className="pd-modal-backdrop" onClick={onClose}>
        <div className="pd-modal pd-modal--form" onClick={(e) => e.stopPropagation()}>
          <h3 className="pd-modal-title">Add information of the child</h3>
          <div className="pd-modal-form-row">
            <div className="pd-modal-field">
              <label className="pd-modal-label">Full name</label>
              <input className="pd-modal-input" name="fullName" value={form.fullName} onChange={handleChange} />
            </div>
            <div className="pd-modal-field">
              <label className="pd-modal-label">Student ID</label>
              <input className="pd-modal-input" name="studentId" placeholder="e.g. STU002" value={form.studentId} onChange={handleChange} />
            </div>
          </div>
          <div className="pd-modal-field pd-modal-field--full">
            <label className="pd-modal-label">E-mail</label>
            <input className="pd-modal-input" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          {error && <p className="pd-modal-error">{error}</p>}
          <button className="pd-modal-submit-btn" onClick={handleAdd}>Update Information</button>
          {linkedChildren.length > 1 && (
            <button className="pd-modal-back-link" onClick={() => setView("list")}>← Back to children list</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pd-modal-backdrop" onClick={onClose}>
      <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="pd-modal-title">Switch Child</h3>
        {linkedChildren.map((s) => (
          <button
            key={s.id}
            className={`pd-modal-item ${s.id === currentId ? "active" : ""}`}
            onClick={() => { onSelect(s.id); onClose(); }}
          >
            <div className="pd-modal-avatar" style={{ background: s.avatarColor }}>{s.initials}</div>
            <div>
              <p className="pd-modal-name">{s.firstName} {s.lastName}</p>
              <p className="pd-modal-sub">{s.grade} · {s.stream} stream</p>
            </div>
            {s.id === currentId && <span className="pd-modal-check">✓</span>}
          </button>
        ))}
        <div className="pd-modal-divider" />
        <button
          className="pd-modal-add-another-btn"
          onClick={() => { setForm({ fullName: "", studentId: "", email: "" }); setError(""); setView("add"); }}
        >
          + Add another child
        </button>
      </div>
    </div>
  );
}
