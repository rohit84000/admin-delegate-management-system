import { Outlet, NavLink } from "react-router-dom";
import { logout } from "../utils/auth";

export default function AdminLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <span className="navbar-brand fw-bold">Admin Panel</span>

        <div className="ms-auto">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => logout("/admin/login")}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Body */}
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">

          {/* Sidebar */}
          <div className="col-md-2 bg-light border-end p-0">
            <div className="list-group list-group-flush">
              <NavLink
                to="/admin/dashboard"
                end
                className="list-group-item list-group-item-action"
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/categories"
                className="list-group-item list-group-item-action"
              >
                Categories
              </NavLink>

              <NavLink
                to="/admin/delegates"
                className="list-group-item list-group-item-action"
              >
                Delegates
              </NavLink>

              <NavLink
                to="/admin/users"
                className="list-group-item list-group-item-action"
              >
                Users
              </NavLink>
            </div>
          </div>

          {/* Content */}
          <div className="col-md-10 p-4">
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  );
}
