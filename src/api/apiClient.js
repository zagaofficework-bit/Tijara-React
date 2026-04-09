import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://www.zagainstitute.com/tijaraa/public",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

/* ── Response interceptor – handle 401 ── */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
