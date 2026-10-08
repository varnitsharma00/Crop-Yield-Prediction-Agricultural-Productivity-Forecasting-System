// File: frontend/components/Navbar.tsx

"use client";

import { useRouter } from "next/navigation";

const ROLE_LABELS: Record<string, string> = {
  farmer: "Farmer",
  cooperative: "Cooperative Member",
  agribusiness: "Agribusiness",
  government: "Government Officer",
  admin: "Admin",
};

export default function Navbar() {
  const router = useRouter();
  const role = typeof window !== "undefined" ? localStorage.getItem("ys_role") : null;

  function handleLogout() {
    localStorage.removeItem("ys_access_token");
    localStorage.removeItem("ys_role");
    localStorage.removeItem("ys_profile");
    router.push("/login");
  }

  return (
    <nav className="navbar">
      <div className="brand">🌾 YieldSense AI</div>
      <div className="navLinks">
        <a href="/predict" className="navLink">Predict</a>
        <a href="/dashboard" className="navLink">Dashboard</a>
      </div>
      <div className="right">
        {role && (
          <span className="roleBadge">
            {ROLE_LABELS[role] ?? role}
          </span>
        )}
        <button className="logoutBtn" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: #ffffff;
          border-bottom: 1px solid #e0e0e0;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .brand {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1b5e20;
        }
        .navLinks { display: flex; gap: 1.5rem; }
        .navLink { color: #374151; font-size: 0.9rem; font-weight: 600; text-decoration: none; }
        .navLink:hover { color: #15803d; }
        .right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .roleBadge {
          background: #e8f5e9;
          color: #1b5e20;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
        }
        .logoutBtn {
          background: none;
          border: 1px solid #e0e0e0;
          color: #5f6368;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .logoutBtn:hover {
          border-color: #c62828;
          color: #c62828;
        }
      `}</style>
    </nav>
  );
}
