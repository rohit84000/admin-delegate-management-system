import { Link } from "react-router-dom";

export default function AdminDashboard({ admin }) {
  return (
    <div className="container mt-4">

      {/* Admin Info */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h4 className="mb-1">
            Welcome, {admin.first_name} {admin.last_name}
          </h4>
          <p className="text-muted mb-0">Email: {admin.email}</p>
          <p className="mb-0">
            Role: <span className="badge bg-dark">{admin.role}</span>
          </p>
          <p>
            Status:{" "}
            <span className={
              admin.type === "active"
                ? "badge bg-success"
                : "badge bg-danger"
            }>
              {admin.type}
            </span>
          </p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="row">

        {/* Delegates Card */}
        <div className="col-md-6">
          <div className="card shadow text-center">
            <div className="card-body">
              <h5 className="card-title">Delegates</h5>
              <p className="card-text">
                Manage all delegates, assign categories and status.
              </p>
              <Link to="/admin/delegates" className="btn btn-primary">
                Manage Delegates
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Card */}
        <div className="col-md-6">
          <div className="card shadow text-center">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <p className="card-text">
                Create and manage category feed messages.
              </p>
              <Link to="/admin/categories" className="btn btn-success">
                Manage Categories
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
