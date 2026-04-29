// src/api/api.js
const BASE_URL = "http://localhost:8000";

async function apiPost(endpoint, data, isFormData = false) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || "Something went wrong");
  return json;
}

// ── Sign Ups ──────────────────────────────────────────
export const signUpStudent = (data) => apiPost("/students/", data);
export const signUpParent  = (data) => apiPost("/parents/", data);
export const signUpSchool  = (data) => apiPost("/schools/", data);
export const signUpAdmin   = (data) => apiPost("/admins/", data);

// ── Login ─────────────────────────────────────────────
export const login = (email, password) => {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  return apiPost("/login", form, true);
};