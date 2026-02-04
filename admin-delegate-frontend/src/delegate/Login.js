import { useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "../utils/validators";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await client.post("/delegate/login", {
        email,
        password
      });

      // store token
      localStorage.setItem("token", res.data.token);

      // set global user
      setUser(res.data.user);

      // redirect
      navigate("/dashboard");

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 403) {
        setError("You are not allowed to login here");
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
          <h4 className="text-center mb-4">Delegate Login</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary w-100"
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
