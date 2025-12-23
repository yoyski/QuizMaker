import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Navigation } from "./navigation";

const MainLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/AuthPage" replace />;
  }// you need this to directly go to authpage without refreshing the page when click logout 

  return (
    <>
      <Navigation /> {/* Fixed navbar at top */}
      <main>
        <Outlet />
      </main>
      <footer>{/* Optional Footer */}</footer>
    </>
  );
};

export default MainLayout;
