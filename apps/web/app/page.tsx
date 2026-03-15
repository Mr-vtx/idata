"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

const UPLOAD_URL = "https://idata-8jhr.onrender.com";

export default function Home() {
  const [typed, setTyped] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const lines = [
    {
      prefix: "$ ",
      text: `curl -X POST ${UPLOAD_URL}/v1/upload \\`,
      color: "#e2e8f0",
    },
    {
      prefix: "  ",
      text: `-H "Authorization: Bearer id_live_••••••" \\`,
      color: "#94a3b8",
    },
    { prefix: "  ", text: `-F "file=@movie.mp4"`, color: "#94a3b8" },
    { prefix: "", text: "", color: "" },
    {
      prefix: "→ ",
      text: `{ "fileId": "6a3f9c", "url": "https://cdn.idata.dev/files/6a3f9c" }`,
      color: "#4ade80",
    },
  ];

useEffect(() => {
  if (lineIndex >= lines.length) return;

  const line = lines[lineIndex];
  if (!line) return;

  // blank spacer line
  if (!line.text && !line.prefix) {
    const spacer = setTimeout(() => setLineIndex((l) => l + 1), 200);
    return () => clearTimeout(spacer);
  }

  const full = line.prefix + line.text;
  let i = typed.length;

  if (i >= full.length) {
    const next = setTimeout(() => {
      setTyped("");
      setLineIndex((l) => l + 1);
    }, 400);
    return () => clearTimeout(next);
  }

  const t = setTimeout(
    () => {
      setTyped(full.slice(0, i + 1));
    },
    lineIndex < 3 ? 28 : 12,
  );

  return () => clearTimeout(t);
}, [typed, lineIndex, lines]);
  const completedLines = lines.slice(0, lineIndex);
  const currentLine = lineIndex < lines.length ? lines[lineIndex] : null;

  return (
    <>
      <div className="land-root">
        <div className="grid-bg" />

        {/* Navbar */}
        <Navbar />

        {/* Hero */}
        <div className="section">
          <div className="hero">
            <div className="hero-split">
              <div>
                <div className="hero-eyebrow">
                  Open beta · Free tier available
                </div>
                <h1 className="hero-title">
                  File storage for <span className="accent">builders</span>
                </h1>
                <p className="hero-sub">
                  Upload anything up to 2GB. Get an instant CDN URL. Stream
                  videos. Serve images. Integrate via REST API. No AWS bill. No
                  vendor lock-in.
                </p>
                <div className="hero-cta">
                  <Link href="/register" className="btn-primary">
                    Start free →
                  </Link>
                  <Link
                    href="https://idata-docs.vercel.app"
                    className="btn-ghost"
                    target="_blank"
                  >
                    Read docs
                  </Link>
                </div>
                <div className="stats-bar">
                  {[
                    { val: "2GB", label: "max file size" },
                    { val: "∞", label: "storage" },
                    { val: "$0", label: "to start" },
                  ].map((s) => (
                    <div key={s.label} className="stat-item">
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal */}
              <div>
                <div className="terminal" ref={terminalRef}>
                  <div className="terminal-bar">
                    <div
                      className="terminal-dot"
                      style={{ background: "#ef4444" }}
                    />
                    <div
                      className="terminal-dot"
                      style={{ background: "#fbbf24" }}
                    />
                    <div
                      className="terminal-dot"
                      style={{ background: "#4ade80" }}
                    />
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.7rem",
                        color: "var(--ink-3)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      idata — upload
                    </span>
                  </div>
                  <div className="terminal-body">
                    {completedLines.map((line, i) => (
                      <div
                        key={i}
                        className="terminal-line"
                        style={{ color: line.color }}
                      >
                        <span
                          className="terminal-prefix"
                          style={{
                            color:
                              line.prefix === "→ " ? "#4ade80" : "var(--ink-3)",
                          }}
                        >
                          {line.prefix}
                        </span>
                        <span>{line.text}</span>
                      </div>
                    ))}
                    {currentLine && (
                      <div className="terminal-line">
                        <span
                          className="terminal-prefix"
                          style={{
                            color:
                              currentLine.prefix === "→ "
                                ? "#4ade80"
                                : "var(--ink-3)",
                          }}
                        >
                          {typed.slice(0, currentLine.prefix.length)}
                        </span>
                        <span style={{ color: currentLine.color }}>
                          {typed.slice(currentLine.prefix.length)}
                        </span>
                        <span className="terminal-cursor" />
                      </div>
                    )}
                  </div>
                </div>

                {/* floating badges */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    "Range requests",
                    "CDN streaming",
                    "Signed URLs",
                    "REST API",
                  ].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.65rem",
                        color: "var(--ink-3)",
                        border: "1px solid var(--rule-2)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="section-divider" />

        {/* Features */}
        <div className="section">
          <div className="features-section">
            <div className="section-label">// capabilities</div>
            <h2 className="section-title">Built different</h2>
            <p className="section-sub">
              Everything you need to store, serve, and stream files — without
              the complexity or the cloud bill.
            </p>

            <div className="features-grid">
              {[
                {
                  icon: "↑",
                  title: "Upload anything",
                  desc: "Videos, images, docs, archives. Any format. Files up to 2GB streamed directly to storage.",
                },
                {
                  icon: "⚡",
                  title: "Edge CDN delivery",
                  desc: "Files served from Cloudflare edge. Range requests supported. Video seeking works out of the box.",
                },
                {
                  icon: "🔗",
                  title: "Instant embed URLs",
                  desc: "Images served inline. Videos stream directly. Drop the URL in any <img> or <video> tag.",
                },
                {
                  icon: "🔑",
                  title: "API key auth",
                  desc: "Generate API keys from your dashboard. Upload from any server, CLI, or script.",
                },
                {
                  icon: "🛡",
                  title: "Signed download links",
                  desc: "Time-limited signed URLs. Share files securely without exposing your storage backend.",
                },
                {
                  icon: "📦",
                  title: "Storage quotas",
                  desc: "Per-user storage limits. Track usage in real time. Scale your plan as you grow.",
                },
              ].map((f) => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="section-divider" />

        {/* Compare */}
        <div className="section">
          <div className="compare-section">
            <div className="section-label">// comparison</div>
            <h2 className="section-title">Why iData?</h2>
            <p className="section-sub">
              Same result as the expensive alternatives. Without the bill.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="highlight">
                      iData <span className="tag-free">FREE</span>
                    </th>
                    <th>Cloudinary</th>
                    <th>Backblaze B2</th>
                    <th>AWS S3</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Storage cost",
                      <span className="check">$0</span>,
                      "$0.37/GB credit",
                      "$0.006/GB/mo",
                      "$0.023/GB/mo",
                    ],
                    [
                      "Max file size",
                      <span className="check">2GB</span>,
                      "2GB (paid)",
                      "No limit",
                      "5TB",
                    ],
                    [
                      "CDN delivery",
                      <span className="check">✓ Cloudflare</span>,
                      "✓ Built-in",
                      "Extra cost",
                      "Extra cost",
                    ],
                    [
                      "Video streaming",
                      <span className="check">✓ Range requests</span>,
                      "✓ Paid plans",
                      "Manual",
                      "Manual",
                    ],
                    [
                      "Signed URLs",
                      <span className="check">✓</span>,
                      "✓",
                      "✓",
                      "✓",
                    ],
                    [
                      "REST API",
                      <span className="check">✓</span>,
                      "✓",
                      "✓ S3-compat",
                      "✓",
                    ],
                    [
                      "Image embed URLs",
                      <span className="check">✓ inline</span>,
                      "✓",
                      "✗",
                      "✗",
                    ],
                    [
                      "Free tier storage",
                      <span className="check">10GB</span>,
                      "25 credits",
                      "10GB",
                      "5GB 12mo",
                    ],
                  ].map(([feature, ...vals]) => (
                    <tr key={String(feature)}>
                      <td>{feature}</td>
                      {vals.map((v, i) => (
                        <td key={i} className={i === 0 ? "highlight" : ""}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <hr className="section-divider" />

        {/* API preview */}
        <div className="section">
          <div className="api-section">
            <div className="section-label">// integration</div>
            <h2 className="section-title">Integrate in minutes</h2>
            <p className="section-sub">
              One endpoint. Any language. Upload a file, get a URL back. That's
              it.
            </p>

            <div className="api-grid">
              <div className="code-block">
                <div className="code-header">
                  <span className="code-lang">bash</span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--green)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    upload
                  </span>
                </div>
                <div className="code-body">
                  <div>
                    <span className="cm"># Upload any file</span>
                  </div>
                  <div>
                    <span className="fn">curl</span> -X POST \
                  </div>
                  <div>
                    {"  "}
                    <span className="str">"{UPLOAD_URL}/v1/upload"</span> \
                  </div>
                  <div>
                    {"  "}-H{" "}
                    <span className="str">
                      "Authorization: Bearer id_live_••••"
                    </span>{" "}
                    \
                  </div>
                  <div>
                    {"  "}-F <span className="str">"file=@photo.jpg"</span>
                  </div>
                  <div style={{ marginTop: "0.75rem" }}>
                    <span className="cm"># Response</span>
                  </div>
                  <div>{"{"}</div>
                  <div>
                    {"  "}
                    <span className="var">"fileId"</span>:{" "}
                    <span className="str">"6a3f9c"</span>,
                  </div>
                  <div>
                    {"  "}
                    <span className="var">"url"</span>:{" "}
                    <span className="str">
                      "https://cdn.idata.dev/files/6a3f9c"
                    </span>
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>

              <div className="code-block">
                <div className="code-header">
                  <span className="code-lang">javascript</span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--green)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    node.js
                  </span>
                </div>
                <div className="code-body">
                  <div>
                    <span className="kw">const</span>{" "}
                    <span className="var">form</span> ={" "}
                    <span className="kw">new</span>{" "}
                    <span className="fn">FormData</span>()
                  </div>
                  <div>
                    <span className="var">form</span>.
                    <span className="fn">append</span>(
                    <span className="str">'file'</span>, fileBuffer, fileName)
                  </div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <span className="kw">const</span>{" "}
                    <span className="var">res</span> ={" "}
                    <span className="kw">await</span>{" "}
                    <span className="fn">fetch</span>(
                  </div>
                  <div>
                    {"  "}
                    <span className="str">'{UPLOAD_URL}/v1/upload'</span>,
                  </div>
                  <div>
                    {"  "}
                    {"{"} <span className="var">method</span>:{" "}
                    <span className="str">'POST'</span>,
                  </div>
                  <div>
                    {"    "}
                    <span className="var">headers</span>: {"{"}{" "}
                    <span className="var">Authorization</span>:{" "}
                    <span className="str">`Bearer ${"${API_KEY}"}`</span> {"}"}
                  </div>
                  <div>
                    {"    "}
                    <span className="var">body</span>:{" "}
                    <span className="var">form</span> {"}"}
                  </div>
                  <div>)</div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <span className="kw">const</span> {"{"}{" "}
                    <span className="var">url</span> {"}"} ={" "}
                    <span className="kw">await</span>{" "}
                    <span className="var">res</span>.
                    <span className="fn">json</span>()
                  </div>
                  <div>
                    <span className="cm">// url → CDN link, ready to use</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="section cta-section">
          <div className="cta-glow" />
          <h2 className="cta-title">Ready to ship?</h2>
          <p className="cta-sub">
            Free account. No card. No setup. Just upload.
          </p>
          <div className="cta-buttons">
            <Link
              href="/register"
              className="btn-primary"
              style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}
            >
              Create free account →
            </Link>
            <Link
              href="https://idata-docs.vercel.app"
              className="btn-ghost"
              style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}
              target="_blank"
            >
              API reference
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{ borderTop: "1px solid var(--rule)", padding: "1.5rem" }}
        >
          <div className="footer">
            <Link href="/" className="footer-logo">
              <span className="footer-logo-mark">i</span>
              Data
            </Link>
            <div className="footer-links">
              <a href="https://idata-docs.vercel.app" target="_blank">
                Docs
              </a>
              <a href="/dashboard/keys">API Keys</a>
              <a href="/register">Sign up</a>
            </div>
            <span className="footer-copy">
              © 2026 iData. Built for builders.
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
