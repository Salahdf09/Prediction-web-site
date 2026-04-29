// TODO: replace with API calls when backend team delivers prediction endpoints
// Each student entry mirrors the shape expected from the real API

export const mockStudents = [
  {
    id: 1,
    userCode: "STU001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@student.edu",
    grade: "3rd Year",
    stream: "Science",
    initials: "SJ",
    avatarColor: "#3a6a92",
    lastUpdate: "2 days ago",
    currentAverage: 14.2,
    attendanceRate: 92,
    attendance: { pass: 873, risk: 295, fall: 119 },
    trimesters: [
      { label: "Trimester 1", grade: 15.1 },
      { label: "Trimester 2", grade: 12.3 },
      { label: "Trimester 3", grade: 14.5 },
    ],
    predictedBAC: 15.1,
    successProbability: "HIGH",
    riskAlerts: [
      { trimester: 1, change: "-1.3", severity: "medium" },
    ],
    orientation: {
      recommended: {
        name: "Science Stream",
        compatibility: 82,
        description: "Option based on strong math and physics performance",
      },
      alternatives: [
        { name: "Technical Math", compatibility: 74 },
        { name: "Literature", compatibility: 61 },
      ],
    },
  },
  {
    id: 2,
    userCode: "STU002",
    firstName: "Karim",
    lastName: "Benali",
    email: "karim.benali@student.edu",
    grade: "3rd Year",
    stream: "Math",
    initials: "KB",
    avatarColor: "#5a3a92",
    lastUpdate: "1 day ago",
    currentAverage: 11.8,
    attendanceRate: 78,
    attendance: { pass: 620, risk: 310, fall: 58 },
    trimesters: [
      { label: "Trimester 1", grade: 13.0 },
      { label: "Trimester 2", grade: 11.5 },
      { label: "Trimester 3", grade: 10.9 },
    ],
    predictedBAC: 11.2,
    successProbability: "MEDIUM",
    riskAlerts: [
      { trimester: 2, change: "-1.5", severity: "high" },
      { trimester: 3, change: "-0.6", severity: "medium" },
    ],
    orientation: {
      recommended: {
        name: "Technical Math",
        compatibility: 71,
        description: "Good analytical skills with a practical approach to problem solving",
      },
      alternatives: [
        { name: "Management", compatibility: 65 },
        { name: "Literature", compatibility: 48 },
      ],
    },
  },
  {
    id: 3,
    userCode: "STU003",
    firstName: "Amira",
    lastName: "Mansouri",
    email: "amira.mansouri@student.edu",
    grade: "3rd Year",
    stream: "Literature",
    initials: "AM",
    avatarColor: "#924a3a",
    lastUpdate: "3 hours ago",
    currentAverage: 16.4,
    attendanceRate: 97,
    attendance: { pass: 940, risk: 52, fall: 8 },
    trimesters: [
      { label: "Trimester 1", grade: 15.8 },
      { label: "Trimester 2", grade: 16.2 },
      { label: "Trimester 3", grade: 17.2 },
    ],
    predictedBAC: 17.0,
    successProbability: "HIGH",
    riskAlerts: [],
    orientation: {
      recommended: {
        name: "Literature Stream",
        compatibility: 91,
        description: "Exceptional language skills and consistent high performance across subjects",
      },
      alternatives: [
        { name: "Social Sciences", compatibility: 79 },
        { name: "Science", compatibility: 63 },
      ],
    },
  },
];

// TODO: replace with API call → GET /students/me
export function getCurrentStudent() {
  return mockStudents[0];
}

// TODO: replace with API call → GET /students/:id
export function getStudentById(id) {
  return mockStudents.find((s) => s.id === id) ?? mockStudents[0];
}

export function computeRiskLevel(attendanceRate) {
  if (attendanceRate < 75) return "HIGH";
  if (attendanceRate < 90) return "MEDIUM";
  return "LOW";
}

export function computeStatusLabel(avg) {
  if (avg === null || avg === undefined || isNaN(avg)) return null;
  if (avg >= 14) return { label: "Good", color: "#2a7a2a", bg: "#d4f5d4" };
  if (avg >= 10) return { label: "Average", color: "#856404", bg: "#fff3cd" };
  return { label: "At Risk", color: "#b91c1c", bg: "#fee2e2" };
}
