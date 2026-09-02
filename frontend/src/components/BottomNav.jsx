import { NavLink } from "react-router-dom";
import { Gamepad2, HeartPulse, Home, LineChart, User } from "lucide-react";
import { useLanguage } from "../i18n.js";

export default function BottomNav() {
  const { t } = useLanguage();

  const LINKS = [
    { to: "/dashboard", label: t("home"), icon: Home },
    { to: "/progress", label: t("progress"), icon: LineChart },
    { to: "/daily-care", label: t("dailyCare"), icon: HeartPulse },
    { to: "/profile", label: t("profile"), icon: User },
    { to: "/activities", label: t("activity"), icon: Gamepad2 },
  ];

  return (
    <nav className="bottom-nav bottom-nav--themed" aria-label="Main navigation">
      {LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
          <Icon size={26} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
