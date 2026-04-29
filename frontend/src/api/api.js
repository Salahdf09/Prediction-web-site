const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function parseDetail(detail) {
  if (!detail) return "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e.msg).join(", ");
  return "Something went wrong";
}

async function apiRequest(endpoint, { method = "GET", data, auth = true } = {}) {
  const token = localStorage.getItem("token");
  const headers = {};

  if (data !== undefined) headers["Content-Type"] = "application/json";
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(parseDetail(json.detail));
  return json;
}

const apiGet = (endpoint) => apiRequest(endpoint);
const apiPost = (endpoint, data, options) => apiRequest(endpoint, { method: "POST", data, ...options });

function fullName(data, fallback = "User") {
  if (data.name) return data.name;
  if (data.username) return data.username;
  if (data.firstName || data.familyName) return `${data.firstName || ""} ${data.familyName || ""}`.trim();
  return fallback;
}

// Sign ups
export const signUpStudent = (data) =>
  apiPost(
    "/students/register",
    {
      email: data.email,
      password: data.password,
      name: fullName(data, data.email?.split("@")[0] || "Student"),
      firstName: data.firstName,
      familyName: data.familyName,
      schoolName: data.schoolName,
      level: data.level || data.stream || null,
      stream: data.stream || null,
      studentPersonalId: data.studentPersonalId || null,
    },
    { auth: false },
  );

export const signUpParent = (data) =>
  apiPost(
    "/parents/register",
    {
      email: data.email,
      password: data.password,
      name: fullName(data, data.email?.split("@")[0] || "Parent"),
      phone_number: data.phone_number || data.phoneNumber || null,
      phone: data.phone || data.phone_number || data.phoneNumber || null,
      student_code: data.student_code || null,
    },
    { auth: false },
  );

export const signUpSchool = (data) =>
  apiPost(
    "/schools/register",
    {
      email: data.email,
      password: data.password,
      name: data.name || data.schoolName,
      address: data.address,
      phone: data.phone || null,
      school_code: data.school_code || null,
    },
    { auth: false },
  );

export const signUpAdmin = (data) =>
  apiPost(
    "/admins/register",
    {
      email: data.email,
      password: data.password,
      name: data.name || data.username || data.fullName,
      username: data.username || data.fullName,
      access_level: data.access_level || "admin",
      department: data.department || "Administration",
      admin_code: data.admin_code || null,
    },
    { auth: false },
  );

// Login
export async function login(email, password) {
  const roles = ["student", "parent", "school", "admin"];
  let lastError = null;

  for (const role of roles) {
    try {
      return await apiPost("/auth/login", { email, password, role }, { auth: false });
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Invalid credentials");
}

// Student dashboard
export const getStudentProfile = () => apiGet("/students/me");
export const getStudentProgress = (studentId) => apiGet(`/students/${studentId}/progress`);
export const getStudentPrediction = (studentId) => apiGet(`/students/${studentId}/prediction`);
export const getStudentOrientation = (studentId) => apiGet(`/students/${studentId}/orientation`);

// Parent dashboard
export const getParentProfile = () => apiGet("/parents/me");
export const getParentChildren = (parentId) => apiGet(`/parents/${parentId}/children`);
export const getParentChildProgress = (parentId, studentId) => apiGet(`/parents/${parentId}/child/${studentId}/progress`);
export const getParentChildPrediction = (parentId, studentId) => apiGet(`/parents/${parentId}/child/${studentId}/prediction`);
export const getParentChildOrientation = (parentId, studentId) => apiGet(`/parents/${parentId}/child/${studentId}/orientation`);

// School/admin dashboards
export const getSchoolStatistics = (schoolId) => apiGet(`/schools/${schoolId}/statistics`);
export const getSchoolStudents = (schoolId) => apiGet(`/schools/${schoolId}/students`);
export const getAdminStatistics = (adminId) => apiGet(`/admins/${adminId}/statistics`);
