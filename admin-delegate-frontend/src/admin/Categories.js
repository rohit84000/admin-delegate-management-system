import { useEffect, useState } from "react";
import client from "../api/client";
import { validateCategory } from "../utils/validators";

export default function Categories() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", feed_message: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await client.get("/categories");
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    // Frontend validation
    const err = validateCategory(form);
    if (err) return setError(err);

    try {
      setLoading(true);
      setError("");

      if (editId) {
        await client.put(`/categories/${editId}`, form);
      } else {
        await client.post("/categories", form);
      }

      // reset
      setForm({ name: "", feed_message: "" });
      setEditId(null);
      load();

    } catch (err) {
      // Backend validation (422)
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

  const edit = (cat) => {
    setForm({
      name: cat.name,
      feed_message: cat.feed_message
    });
    setEditId(cat.id);
    setError("");
  };

  const remove = async (id) => {
    if (!window.confirm("Delete category?")) return;
    await client.delete(`/categories/${id}`);
    load();
  };

  return (
    <div className="row">
      {/* Form */}
      <div className="col-md-4">
        <div className="card shadow">
          <div className="card-body">
            <h5>{editId ? "Edit" : "Add"} Category</h5>

            {error && <div className="alert alert-danger">{error}</div>}

            <input
              className="form-control mb-2"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="form-control mb-3"
              placeholder="Feed Message"
              value={form.feed_message}
              onChange={e => setForm({ ...form, feed_message: e.target.value })}
            />

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
                onClick={() => {
                  setForm({ name: "", feed_message: "" });
                  setEditId(null);
                  setError("");
                }}
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
            <h5>Categories List</h5>

            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Feed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.feed_message}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => edit(c)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => remove(c.id)}
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
                No categories found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
