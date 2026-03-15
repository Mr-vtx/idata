"use client";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="docs-layout">
      {/* Mobile top bar */}
      <div className="docs-topbar">
        <button
          className="docs-hamburger"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
        <Link href="/" className="docs-topbar-logo">
          <span className="docs-topbar-logo-mark">i</span>
          Data
          <span className="docs-topbar-label">docs</span>
        </Link>
      </div>

      {/* Overlay (mobile only) */}
      {open && <div className="docs-overlay" onClick={() => setOpen(false)} />}

      <Sidebar isOpen={open} onClose={() => setOpen(false)} />

      <main className="docs-main">{children}</main>
    </div>
  );
}
