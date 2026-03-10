"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    section: "Getting Started",
    links: [
      { href: "/", label: "Introduction" },
      { href: "/quickstart", label: "Quickstart" },
      { href: "/authentication", label: "Authentication" },
    ],
  },
  {
    section: "API Reference",
    links: [
      { href: "/api/upload", label: "Upload file" },
      { href: "/api/download", label: "Download file" },
      { href: "/api/files", label: "List files" },
      { href: "/api/keys", label: "API Keys" },
    ],
  },
  {
    section: "Auth",
    links: [
      { href: "/api/auth/register", label: "Register" },
      { href: "/api/auth/login", label: "Login" },
    ],
  },
  {
    section: "SDKs",
    links: [
      { href: "/sdk/javascript", label: "JavaScript / Node.js" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "240px",
      flexShrink: 0,
      borderRight: "1px solid var(--border)",
      height: "100vh",
      position: "sticky",
      top: 0,
      overflowY: "auto",
      padding: "1.5rem 0",
    }}>
      {/* logo */}
      <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "1rem" }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          fontWeight: 700, fontSize: "1rem", color: "var(--text)",
        }}>
          <span style={{ background: "var(--accent)", color: "#fff", padding: "0.15rem 0.4rem", borderRadius: "4px", fontSize: "0.8rem" }}>i</span>
          <span>Data</span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "0.25rem" }}>docs</span>
        </Link>
      </div>

      {nav.map((group) => (
        <div key={group.section} style={{ marginBottom: "1.5rem", padding: "0 1rem" }}>
          <div style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            marginBottom: "0.5rem",
            padding: "0 0.25rem",
          }}>
            {group.section}
          </div>
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                color: pathname === link.href ? "var(--text)" : "var(--text-secondary)",
                background: pathname === link.href ? "var(--surface-2)" : "transparent",
                fontWeight: pathname === link.href ? 500 : 400,
                transition: "all var(--transition)",
                marginBottom: "0.1rem",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
