import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Navigation } from "./navigation";

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuthStore();

  // ✅ Proper loading screen
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }

  // ✅ Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/AuthPage" replace />;
  }

  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;