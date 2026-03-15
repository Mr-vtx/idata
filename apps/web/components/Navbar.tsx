"use client";
import Link from "next/link";
import { useStore } from "../lib/store";
import { useTheme } from "./ThemeProvider";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { user, logout } = useStore();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/keys", label: "API Keys" },
        { href: "/upload", label: "Upload" },
      ]
    : [];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          background: scrolled
            ? "color-mix(in srgb, var(--bg) 85%, transparent)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled
            ? "1px solid color-mix(in srgb, var(--border) 60%, transparent)"
            : "1px solid transparent",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "7px",
              fontSize: "0.85rem",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              boxShadow:
                "0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent)",
            }}
          >
            i
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "-0.04em",
              color: "var(--text)",
            }}
          >
            Data
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}
          className="desktop-nav"
        >
          {navLinks.map(({ href, label }) => (
            <NavLink key={href} href={href} active={isActive(href)}>
              {label}
            </NavLink>
          ))}

          {user && (
            <div
              style={{
                width: "1px",
                height: "18px",
                background: "var(--border)",
                margin: "0 0.5rem",
                opacity: 0.6,
              }}
            />
          )}

          {/* Auth area */}
          {user ? (
            <div
              ref={userMenuRef}
              style={{ position: "relative", marginLeft: "0.25rem" }}
            >
              {/* Avatar pill button */}
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.3rem 0.6rem 0.3rem 0.3rem",
                  borderRadius: "10px",
                  border: `1px solid ${userMenuOpen ? "var(--accent)" : "var(--border)"}`,
                  background: userMenuOpen
                    ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                    : "var(--surface)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "26px",
                    height: "26px",
                    borderRadius: "7px",
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {user.username?.slice(0, 2).toUpperCase() || "U"}
                </span>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--text)",
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.username}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  style={{
                    color: "var(--text-muted)",
                    transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <path
                    d="M2 3.5L5 6.5L8 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dropdown — user info + sign out only, no duplicate nav links */}
              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    minWidth: "210px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
                    animation: "dropIn 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {/* User info */}
                  <div
                    style={{
                      padding: "0.875rem 1rem",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "34px",
                          height: "34px",
                          borderRadius: "8px",
                          background: "var(--accent)",
                          color: "#fff",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {user.username?.slice(0, 2).toUpperCase() || "U"}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: "var(--text)",
                            lineHeight: 1.3,
                          }}
                        >
                          {user.username}
                        </div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {(user as any).email || "iData user"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sign out */}
                  <div style={{ padding: "0.4rem" }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "8px",
                        fontSize: "0.8125rem",
                        color: "#ef4444",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background =
                          "color-mix(in srgb, #ef4444 10%, transparent)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent";
                      }}
                    >
                      <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                        →
                      </span>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                marginLeft: "0.25rem",
              }}
            >
              <Link
                href="/login"
                style={{
                  padding: "0.35rem 0.875rem",
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                  fontWeight: 400,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
              >
                Sign in
              </Link>
              <Link
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#fff",
                  background: "var(--accent)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow:
                    "0 1px 3px color-mix(in srgb, var(--accent) 40%, transparent)",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88";
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(-1px)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 4px 12px color-mix(in srgb, var(--accent) 35%, transparent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 1px 3px color-mix(in srgb, var(--accent) 40%, transparent)";
                }}
              >
                Get started
                <span style={{ fontSize: "0.9rem" }}>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile: theme + hamburger ── */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          className="mobile-nav"
        >
          <button
            onClick={toggle}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: menuOpen ? "var(--surface-2)" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {menuOpen ? (
                <>
                  <line
                    x1="3"
                    y1="3"
                    x2="13"
                    y2="13"
                    stroke="var(--text)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="13"
                    y1="3"
                    x2="3"
                    y2="13"
                    stroke="var(--text)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <>
                  <line
                    x1="2"
                    y1="4.5"
                    x2="14"
                    y2="4.5"
                    stroke="var(--text)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="2"
                    y1="8"
                    x2="14"
                    y2="8"
                    stroke="var(--text)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="2"
                    y1="11.5"
                    x2="14"
                    y2="11.5"
                    stroke="var(--text)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
            background: "color-mix(in srgb, var(--bg) 97%, transparent)",
            backdropFilter: "blur(16px)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            animation: "slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            borderTop: "1px solid var(--border)",
          }}
          className="mobile-menu"
        >
          {user ? (
            <>
              {/* User info card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.875rem 1rem",
                  borderRadius: "12px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {user.username?.slice(0, 2).toUpperCase() || "U"}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    {user.username}
                  </div>
                  <div
                    style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}
                  >
                    {(user as any).email || "iData user"}
                  </div>
                </div>
              </div>

              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    fontSize: "0.9375rem",
                    fontWeight: isActive(href) ? 600 : 400,
                    color: isActive(href) ? "var(--accent)" : "var(--text)",
                    background: isActive(href)
                      ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                      : "transparent",
                    textDecoration: "none",
                    border: isActive(href)
                      ? "1px solid color-mix(in srgb, var(--accent) 20%, transparent)"
                      : "1px solid transparent",
                  }}
                >
                  {label}
                </Link>
              ))}

              <div style={{ flex: 1 }} />

              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.9375rem",
                  color: "#ef4444",
                  background: "color-mix(in srgb, #ef4444 6%, transparent)",
                  border:
                    "1px solid color-mix(in srgb, #ef4444 15%, transparent)",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <span style={{ opacity: 0.7 }}>→</span>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.875rem",
                  borderRadius: "10px",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "var(--text)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  padding: "0.875rem",
                  borderRadius: "10px",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "#fff",
                  background: "var(--accent)",
                  textDecoration: "none",
                  boxShadow:
                    "0 4px 16px color-mix(in srgb, var(--accent) 30%, transparent)",
                }}
              >
                Get started free →
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .desktop-nav { display: flex; }
        .mobile-nav  { display: none; }
        .mobile-menu { display: flex; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </>
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
        padding: "0.35rem 0.75rem",
        borderRadius: "8px",
        fontSize: "0.8125rem",
        color: active ? "var(--text)" : "var(--text-secondary)",
        fontWeight: active ? 600 : 400,
        background: active ? "var(--surface-2)" : "transparent",
        transition: "all 0.15s",
        textDecoration: "none",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
          (e.currentTarget as HTMLAnchorElement).style.background =
            "var(--surface-2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.color =
            "var(--text-secondary)";
          (e.currentTarget as HTMLAnchorElement).style.background =
            "transparent";
        }
      }}
    >
      {children}
      {active && (
        <span
          style={{
            position: "absolute",
            bottom: "0px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "16px",
            height: "2px",
            borderRadius: "2px",
            background: "var(--accent)",
          }}
        />
      )}
    </Link>
  );
}
