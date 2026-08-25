import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})

// Optional response interceptor to extract clean error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return standard rejection so caller services receive the error
    return Promise.reject(error)
  }
)

export default api