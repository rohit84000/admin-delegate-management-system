import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:8000/api"
});

// ✅ Attach token to every request
client.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired session
client.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    const isLoginRoute =
      err.config.url.includes("/delegate/login") ||
      err.config.url.includes("/admin/login");

    if ((status === 401 || status === 403) && !isLoginRoute) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(err);
  }
);

export default client;
