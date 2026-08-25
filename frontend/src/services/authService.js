import api from "./api"

export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData)
  return response.data
}

export async function loginUser(userData) {
  const response = await api.post("/auth/login", userData)
  return response.data
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me")
  return response.data
}

export async function logoutUser() {
  const response = await api.post("/auth/logout")
  return response.data
}

export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email })
  return response.data
}

export async function resetPassword(token, password) {
  const response = await api.post("/auth/reset-password", { token, password })
  return response.data
}