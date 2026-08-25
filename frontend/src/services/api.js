import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})

// Response interceptor to extract clean error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or server not running
      error.customMessage = "Cannot connect to server. Please ensure backend server is running on port 5000."
    }
    return Promise.reject(error)
  }
)

export default api