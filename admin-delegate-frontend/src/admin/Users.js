import { useEffect, useState } from "react";
import client from "../api/client";

export default function Users() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "delegate",
    type: "active"
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await client.get("/users");
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    try {
      setLoading(true);
      setError("");

      if (editId) {
        await client.put(`/users/${editId}`, form);
      } else {
        await client.post("/users", form);
      }

      reset();
      load();

    } catch (err) {
      // 🔥 Backend validation (Laravel 422)
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const edit = (u) => {
    setForm({
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      password: "",
      role: u.role,
      type: u.type
    });
    setEditId(u.id);
    setError("");
  };

  const remove = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await client.delete(`/users/${id}`);
    load();
  };

  const reset = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "delegate",
      type: "active"
    });
    setEditId(null);
    setError("");
  };

  return (
    <div className="row">
      {/* Form */}
      <div className="col-md-4">
        <div className="card shadow">
          <div className="card-body">
            <h5>{editId ? "Edit User" : "Add User"}</h5>

            {error && <div className="alert alert-danger">{error}</div>}

            <input
              className="form-control mb-2"
              placeholder="First name"
              value={form.first_name}
              onChange={e=>setForm({...form,first_name:e.target.value})}
            />

            <input
              className="form-control mb-2"
              placeholder="Last name"
              value={form.last_name}
              onChange={e=>setForm({...form,last_name:e.target.value})}
            />

            <input
              className="form-control mb-2"
              placeholder="Email"
              value={form.email}
              onChange={e=>setForm({...form,email:e.target.value})}
            />

            <input
              className="form-control mb-2"
              type="password"
              placeholder={editId ? "New password (optional)" : "Password"}
              value={form.password}
              onChange={e=>setForm({...form,password:e.target.value})}
            />

            <select
              className="form-control mb-2"
              value={form.role}
              onChange={e=>setForm({...form,role:e.target.value})}
            >
              <option value="admin">Admin</option>
              <option value="delegate">Delegate</option>
            </select>

            <select
              className="form-control mb-3"
              value={form.type}
              onChange={e=>setForm({...form,type:e.target.value})}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              className="btn btn-primary w-100"
              onClick={submit}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editId
                  ? "Update"
                  : "Create"}
            </button>

            {editId && (
              <button
                className="btn btn-secondary w-100 mt-2"
                onClick={reset}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-body">
            <h5>Users</h5>

            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map(u=>(
                  <tr key={u.id}>
                    <td>{u.first_name} {u.last_name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <span className={
                        u.type === "active"
                          ? "badge bg-success"
                          : "badge bg-danger"
                      }>
                        {u.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {list.length === 0 && (
              <div className="text-muted text-center">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
