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
    links: [{ href: "/sdk/javascript", label: "JavaScript / Node.js" }],
  },
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside className={`docs-sidebar${isOpen ? " docs-sidebar--open" : ""}`}>
      {/* Close button — only visible on mobile */}
      <button
        className="docs-sidebar-close"
        onClick={onClose}
        aria-label="Close menu"
      >
        ✕
      </button>

      {/* Logo */}
      <Link href="/" className="docs-sidebar-logo" onClick={onClose}>
        <span className="docs-sidebar-logo-mark">i</span>
        Data
        <span className="docs-sidebar-logo-sub">docs</span>
      </Link>

      {/* Nav groups */}
      {nav.map((group) => (
        <div key={group.section} className="docs-sidebar-group">
          <div className="docs-sidebar-group-label">{group.section}</div>
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`docs-sidebar-link${pathname === link.href ? " docs-sidebar-link--active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
