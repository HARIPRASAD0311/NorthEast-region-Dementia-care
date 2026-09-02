import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav.jsx";
import SmartAssistant from "./SmartAssistant.jsx";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <main id="main-content" className="page-content">
        <Outlet />
      </main>
      <BottomNav />
      <SmartAssistant />
    </div>
  );
}
