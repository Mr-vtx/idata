"use client";
import Link from "next/link";
import { useStore } from "../lib/store";
import { useTheme } from "./ThemeProvider";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useStore();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        backdropFilter: "blur(12px)",
        padding: "0 1.5rem",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* logo */}
      <Link
        href="/"
        style={{
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "-0.03em",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <span
          style={{
            background: "var(--accent)",
            color: "#fff",
            padding: "0.15rem 0.4rem",
            borderRadius: "4px",
            fontSize: "0.8rem",
            fontWeight: 700,
          }}
        >
          i
        </span>
        <span style={{ color: "var(--text)" }}>Data</span>
      </Link>

      {/* nav links + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {user ? (
          <>
            <NavLink href="/dashboard" active={isActive("/dashboard")}>
              Dashboard
            </NavLink>
            <NavLink href="/dashboard/keys" active={isActive("/dashboard/keys")}>API Keys</NavLink>
            <NavLink href="/upload" active={isActive("/upload")}>
              Upload
            </NavLink>
            <div
              style={{
                width: "1px",
                height: "16px",
                background: "var(--border)",
                margin: "0 0.5rem",
              }}
            />
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                padding: "0 0.5rem",
              }}
            >
              {user.username}
            </span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Sign out
            </button>
          </>
        ) : (
          <>
            <NavLink href="/login" active={isActive("/login")}>
              Sign in
            </NavLink>
            <Link
              href="/register"
              className="btn btn-primary btn-sm"
              style={{ marginLeft: "0.25rem" }}
            >
              Get started
            </Link>
          </>
        )}

        {/* theme toggle */}
        <button
          onClick={toggle}
          className="btn btn-ghost btn-sm"
          style={{
            marginLeft: "0.5rem",
            padding: "0.3rem 0.5rem",
            fontSize: "0.9rem",
          }}
          data-tip={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: "0.3rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.875rem",
        color: active ? "var(--text)" : "var(--text-secondary)",
        fontWeight: active ? 500 : 400,
        background: active ? "var(--surface-2)" : "transparent",
        transition: "all var(--transition)",
      }}
    >
      {children}
    </Link>
  );
}
