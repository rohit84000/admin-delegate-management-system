import { useEffect, useState } from "react";
import client from "../api/client";
import { validateDelegate } from "../utils/validators";

export default function Delegates() {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    category_id: "",
    type: "active"
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const [dRes, cRes] = await Promise.all([
      client.get("/delegates"),
      client.get("/categories")
    ]);
    setList(dRes.data);
    setCategories(cRes.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    const err = validateDelegate({ ...form, id: editId });
    if (err) return setError(err);

    if (editId) {
      await client.put(`/delegates/${editId}`, form);
    } else {
      await client.post("/delegates", form);
    }

    reset();
    load();
  };

  const edit = (d) => {
    setForm({
      first_name: d.first_name,
      last_name: d.last_name,
      email: d.email,
      password: "",
      category_id: d.category?.[0]?.id || "",
      type: d.type
    });
    setEditId(d.id);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete delegate?")) return;
    await client.delete(`/delegates/${id}`);
    load();
  };

  const reset = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      category_id: "",
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
            <h5>{editId ? "Edit" : "Add"} Delegate</h5>

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
              type="password"
              className="form-control mb-2"
              placeholder={editId ? "New Password (optional)" : "Password"}
              value={form.password}
              onChange={e=>setForm({...form,password:e.target.value})}
            />

            <select
              className="form-control mb-2"
              value={form.category_id}
              onChange={e=>setForm({...form,category_id:e.target.value})}
            >
              <option value="">Select Category</option>
              {categories.map(c=>(
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              className="form-control mb-3"
              value={form.type}
              onChange={e=>setForm({...form,type:e.target.value})}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button className="btn btn-primary w-100" onClick={submit}>
              {editId ? "Update" : "Create"}
            </button>

            {editId && (
              <button className="btn btn-secondary w-100 mt-2" onClick={reset}>
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
            <h5>Delegates List</h5>

            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d,i)=>(
                  <tr key={d.id}>
                    <td>{i+1}</td>
                    <td>{d.first_name} {d.last_name}</td>
                    <td>{d.email}</td>
                    <td>
                      {d.category.length > 0
                        ? d.category.map(c => (
                            <span key={c.id} className="badge bg-primary me-1">
                              {c.name}
                            </span>
                          ))
                        : "No Category"}
                    </td>
                    <td>
                      <span className={
                        d.type === "active"
                          ? "badge bg-success"
                          : "badge bg-danger"
                      }>
                        {d.type}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={()=>edit(d)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={()=>remove(d.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {list.length === 0 && (
              <div className="text-muted text-center">
                No delegates found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
