import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "../components/ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { TicketDetailsPage } from "../pages/TicketDetailsPage";

export const AppRoutes = () => (
  <Routes>
    <Route element={<HomePage />} path="/" />
    <Route element={<LoginPage />} path="/login" />
    <Route element={<SignupPage />} path="/signup" />
    <Route
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
      path="/dashboard"
    />
    <Route
      element={
        <ProtectedRoute>
          <TicketDetailsPage />
        </ProtectedRoute>
      }
      path="/tickets/:id"
    />
    <Route
      element={
        <ProtectedRoute role="admin">
          <DashboardPage adminView />
        </ProtectedRoute>
      }
      path="/admin"
    />
    <Route element={<Navigate replace to="/" />} path="*" />
  </Routes>
);
