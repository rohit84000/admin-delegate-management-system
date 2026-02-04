import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { validateLogin } from "../utils/validators";

export default function AdminLogin({ setAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    // Frontend validation
    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await client.post("/admin/login", { email, password });

      // 🔐 Store single token
      localStorage.setItem("token", res.data.token);

      // 🧠 Extra safety: role check (frontend)
      if (res.data.user.role !== "admin") {
        setError("You are not allowed to login as admin");
        localStorage.removeItem("token");
        return;
      }

      // Set admin state
      setAdmin(res.data.user);

      // Redirect
      navigate("/admin/dashboard");

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 403) {
        setError("You are not allowed to login as admin");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h4 className="text-center mb-4">Admin Login</h4>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter admin email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button
            type="button"   // ❌ prevents form refresh forever
            className="btn btn-dark w-100"
            onClick={login}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
