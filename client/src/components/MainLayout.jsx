import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Navigation } from "./navigation";

const MainLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);

  // Show layout while loading (overlay will appear on top)
  if (loading) {
    return (
      <>
        <Navigation />
        <main>
          <Outlet />
        </main>
      </>
    );
  }

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/AuthPage" replace />;
  }

  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <footer>{/* Optional Footer */}</footer>
    </>
  );
};

export default MainLayout;