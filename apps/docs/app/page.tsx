"use client";
import Link from "next/link";
import DocsLayout from "./components/DocsLayout";

export default function Intro() {
  return (
    <DocsLayout>
      <div className="docs-status-badge">
        <span className="docs-status-dot" />
        API v1 · Beta
      </div>

      <h1>iData API</h1>
      <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
        iData is a file storage API that lets you upload, store, and stream
        files up to 2GB. Integrate in minutes using our REST API or JavaScript
        SDK.
      </p>

      <div className="docs-cards-grid">
        {[
          {
            title: "Quickstart",
            desc: "Upload your first file in under 5 minutes.",
            href: "/quickstart",
          },
          {
            title: "Authentication",
            desc: "Learn how to authenticate API requests.",
            href: "/authentication",
          },
          {
            title: "Upload API",
            desc: "Upload any file type up to 2GB.",
            href: "/api/upload",
          },
          {
            title: "JavaScript SDK",
            desc: "Use our SDK in Node.js or the browser.",
            href: "/sdk/javascript",
          },
        ].map((card) => (
          <Link key={card.href} href={card.href} className="docs-card">
            <div className="docs-card-title">{card.title}</div>
            <div className="docs-card-desc">{card.desc}</div>
          </Link>
        ))}
      </div>

      <h2>Base URL</h2>
      <pre>
        <code>https://api.idata.dev</code>
      </pre>

      <h2>Request Format</h2>
      <p>
        All API endpoints accept JSON request bodies and return JSON responses.
        File uploads use <code>multipart/form-data</code>.
      </p>

      <h2>Response Format</h2>
      <p>All responses follow a consistent structure:</p>
      <pre>
        <code>{`// Success
{
  "success": true,
  "data": { ... }
}
// Error
{
  "error": "Error message here"
}`}</code>
      </pre>
    </DocsLayout>
  );
}
