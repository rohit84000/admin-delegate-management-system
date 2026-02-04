import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "./api/client";

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import Delegates from "./admin/Delegates";
import Categories from "./admin/Categories";
import Users from "./admin/Users";

import Login from "./delegate/Login";
import Dashboard from "./delegate/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      client.get("/me")
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={<AdminLogin setAdmin={setUser} />}
        />

        {/* ADMIN PROTECTED */}
        <Route
          path="/admin"
          element={
            user?.role === "admin"
              ? <AdminLayout />
              : <AdminLogin setAdmin={setUser} />
          }
        >
          <Route path="dashboard" element={<AdminDashboard admin={user} />} />
          <Route path="delegates" element={<Delegates />} />
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* DELEGATE LOGIN */}
        <Route
          path="/"
          element={
            user?.role === "delegate"
              ? <Dashboard />
              : <Login setUser={setUser} />
          }
        />

        {/* DELEGATE PROTECTED */}
        <Route
          path="/dashboard"
          element={
            user?.role === "delegate"
              ? <Dashboard />
              : <Login setUser={setUser} />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
