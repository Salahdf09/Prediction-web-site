import { useNavigate } from 'react-router-dom';
import './SignUpChoice.css';
import student from '../../Assets2/student-sign.png';
import parent from '../../Assets2/parent-sign.png';
import school from '../../Assets2/school-sign.png';
import admin from '../../Assets2/admin-sign.png';

const options = [
  { role: "Student", icon: student, description: "Track your academic progress" },
  { role: "Parent", icon: parent, description: "Monitor your child's journey" },
  { role: "School", icon: school, description: "Manage your institution" },
  { role: "Admin", icon: admin, description: "Full platform access" },
];

function SignUpChoice() {
  const navigate = useNavigate();

  return (
    <div className="signup-choice">
      <h1>Sign up as</h1>
      <p>Choose your role to get started</p>
      <div className="choice-cards">
        {options.map((option) => (
          <div
            key={option.role}
            className="choice-card"
            onClick={() => navigate(`/signup/${option.role.toLowerCase()}`)}
          >
             <img src={option.icon} alt={option.label} className="choice-icon"/>
            <h2>{option.role}</h2>
            <p>{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SignUpChoice;