"use client";
import Sidebar from "./components/Sidebar";
import Link from "next/link";

export default function Intro() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "3rem", maxWidth: "760px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.25rem 0.75rem", borderRadius: "9999px",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
          fontSize: "0.75rem", color: "var(--accent)", marginBottom: "1.5rem",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          API v1 · Beta
        </div>

        <h1 style={{ marginBottom: "1rem" }}>iData API</h1>
        <p style={{ fontSize: "1rem", marginBottom: "2rem", color: "var(--text-secondary)" }}>
          iData is a file storage API that lets you upload, store, and stream files up to 2GB.
          Integrate in minutes using our REST API or JavaScript SDK.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { title: "Quickstart", desc: "Upload your first file in under 5 minutes.", href: "/quickstart" },
            { title: "Authentication", desc: "Learn how to authenticate API requests.", href: "/authentication" },
            { title: "Upload API", desc: "Upload any file type up to 2GB.", href: "/api/upload" },
            { title: "JavaScript SDK", desc: "Use our SDK in Node.js or the browser.", href: "/sdk/javascript" },
          ].map((card) => (
            <Link key={card.href} href={card.href} style={{
              display: "block", padding: "1.25rem",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", transition: "border-color var(--transition)",
            }}>
              <div style={{ fontWeight: 600, marginBottom: "0.375rem", color: "var(--text)" }}>{card.title}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{card.desc}</div>
            </Link>
          ))}
        </div>

        <h2>Base URL</h2>
        <pre><code>https://api.idata.dev</code></pre>

        <h2>Request Format</h2>
        <p>All API endpoints accept JSON request bodies and return JSON responses. File uploads use <code>multipart/form-data</code>.</p>

        <h2>Response Format</h2>
        <p>All responses follow a consistent structure:</p>
        <pre><code>{`// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "error": "Error message here"
}`}</code></pre>
      </main>
    </div>
  );
}
