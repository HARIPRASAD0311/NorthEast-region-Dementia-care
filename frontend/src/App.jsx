import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import { AccessibilityProvider } from "./components/AccessibilityControls.jsx";
import { LanguageProvider } from "./i18n.js";
import { startReminderNotificationMonitor } from "./services/notifications.js";

import Assessment from "./pages/Assessment.jsx";
import CognitiveProfile from "./pages/CognitiveProfile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Activities from "./pages/Activities.jsx";
import Game from "./pages/Game.jsx";
import GameResult from "./pages/GameResult.jsx";
import Progress from "./pages/Progress.jsx";
import DailyCare from "./pages/DailyCare.jsx";
import Profile from "./pages/Profile.jsx";
import CaregiverDashboard from "./pages/CaregiverDashboard.jsx";
import PatientDetails from "./pages/PatientDetails.jsx";
import LastCardMystery from "./pages/LastCardMystery.jsx";
import AssamConnectionChain from "./pages/AssamConnectionChain.jsx";
import Screening from "./pages/Screening.jsx";

/** Read the auth token written by auth.js after successful login. */
function isAuthenticated() {
  try {
    const raw = localStorage.getItem("smriti_auth");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.authenticated === true;
  } catch {
    return false;
  }
}

/**
 * Wraps a route so unauthenticated users are sent to the HTML login page.
 * We redirect to /auth.html (a static file in /public) rather than a
 * React route, keeping auth entirely in HTML/CSS/JS.
 */
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    window.location.replace("/auth.html");
    return null;
  }
  return children;
}

export default function App() {
  useEffect(() => {
    const stop = startReminderNotificationMonitor();
    return stop;
  }, []);

  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <Routes>
          {/* Standalone pages that do NOT need auth */}
          <Route path="/screening" element={<Screening />} />
          <Route path="/cognitive-profile" element={<CognitiveProfile />} />

          {/* Assessment — first page after login, protected */}
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <Assessment />
              </ProtectedRoute>
            }
          />

          {/* Game screens — full-bleed, protected */}
          <Route
            path="/game/:activityId"
            element={<ProtectedRoute><Game /></ProtectedRoute>}
          />
          <Route
            path="/game-result/:activityId"
            element={<ProtectedRoute><GameResult /></ProtectedRoute>}
          />
          <Route
            path="/last-card-mystery"
            element={<ProtectedRoute><LastCardMystery /></ProtectedRoute>}
          />
          <Route
            path="/assam-connection-chain"
            element={<ProtectedRoute><AssamConnectionChain /></ProtectedRoute>}
          />

          {/* Main app shell with bottom nav — all protected */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/daily-care" element={<DailyCare />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/caregiver" element={<CaregiverDashboard />} />
            <Route path="/patient-details" element={<PatientDetails />} />
          </Route>

          {/*
          Default: authenticated → Assessment intro, not → login.
          ProtectedRoute handles the redirect to /auth.html if needed.
        */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/assessment" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}
