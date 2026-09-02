import { NavLink } from "react-router-dom";
import { LayoutDashboard, Puzzle, LineChart, ClipboardList, User, Users, Mountain } from "lucide-react";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/activities", label: "Activities", icon: Puzzle },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/daily-care", label: "Daily Care", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/caregiver", label: "Caregiver View", icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Mountain size={22} color="var(--gold)" />
        LIMBO
      </div>
      <nav className="sidebar-nav">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">
        Cognitive screening &amp; care support — not a diagnostic tool.
      </div>
    </aside>
  );
}
