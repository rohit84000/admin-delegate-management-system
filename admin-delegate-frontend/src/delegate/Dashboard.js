import { useEffect, useState } from "react";
import { logout } from "../utils/auth";
import client from "../api/client";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    client.get("/delegate/dashboard")
      .then(res => setData(res.data));
      // ❌ no catch here
  }, []);


  if (!data) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center">
            <h4>Delegate Dashboard</h4>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => logout("/")}
            >
              Logout
            </button>
          </div>

          <hr />

          <h5>Welcome, {data.user.first_name} {data.user.last_name}</h5>
          <p className="text-muted">Email: {data.user.email}</p>

           <p>
            Status:{" "}
            <span className={
              data.user.type === "active"
                ? "badge bg-success"
                : "badge bg-danger"
            }>
              {data.user.type}
            </span>
          </p>

          <div className="mt-4">
            {data.category ? (
              <div className="alert alert-info">
                <strong>Your Category Message:</strong>
                <p className="mb-0">{data.category.feed_message}</p>
              </div>
            ) : (
              <div className="alert alert-warning">
                No category assigned yet.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
