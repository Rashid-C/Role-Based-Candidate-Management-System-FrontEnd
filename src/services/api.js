import axios from "axios";
import toast from "react-hot-toast";



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
      'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);

    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  candidateLogin: (data) => api.post("/auth/candidate/login", data),
  adminLogin: (data) => api.post("/auth/admin/login", data),
  logout: () => api.post("/auth/logout"),
};

export const adminAPI = {
  getAllCandidates: () => api.get("/admin/candidates"),
  deleteCandidate: (id) => api.delete(`/admin/candidates/${id}`),
  createCandidate: (data) => api.post("/admin/candidates", data),
};

export const candidateAPI = {
  getProfile: () => api.get("/candidate/profile"),
  uploadProfilePicture: (formData) =>
    api.post("/candidate/profile/picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadResume: (formData) =>
    api.post("/candidate/profile/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default api;
