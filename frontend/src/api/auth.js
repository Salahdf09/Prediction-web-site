// src/api/auth.js
export const saveToken = (token, role, userId) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role || "");
  if (userId !== undefined && userId !== null) {
    localStorage.setItem("user_id", String(userId));
  }
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const getUserId = () => localStorage.getItem("user_id");

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user_id");
};

export const isLoggedIn = () => !!getToken();
