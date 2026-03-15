import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      {/* navbar inline since no auth state on landing */}
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 1.5rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
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
          <span>Data</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            href="/login"
            style={{
              padding: "0.3rem 0.75rem",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            Sign in
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </div>
      </nav>

      {/* hero */}
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "6rem 1.5rem 4rem",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="badge badge-accent">Now in beta · Free to use</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            marginBottom: "1.5rem",
            maxWidth: "700px",
          }}
        >
          File storage built for{" "}
          <span style={{ color: "var(--accent)" }}>developers</span> and teams
        </h1>

        <p
          style={{
            fontSize: "1rem",
            maxWidth: "520px",
            marginBottom: "2.5rem",
            color: "var(--text-secondary)",
          }}
        >
          Upload files up to 2GB, get instant download links, and integrate with
          any project via our simple API. No limits. No traces.
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "5rem",
          }}
        >
          <Link href="/register" className="btn btn-primary btn-lg">
            Start for free →
          </Link>
          <Link
            href="https://idata-docs.vercel.app/"
            className="btn btn-ghost btn-lg"
          >
            View API docs
          </Link>
        </div>

        {/* stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginBottom: "5rem",
          }}
        >
          {[
            { value: "2GB", label: "Max file size" },
            { value: "∞", label: "Storage capacity" },
            { value: "< 1s", label: "API response time" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ background: "var(--surface)", padding: "1.5rem 2rem" }}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--highlight)",
                  marginBottom: "0.25rem",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* features */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "2rem" }}>Everything you need</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1px",
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            {[
              {
                icon: "↑",
                title: "Upload anything",
                desc: "Videos, images, docs, archives — any format up to 2GB per file.",
              },
              {
                icon: "⚡",
                title: "Instant links",
                desc: "Every upload generates a public download URL immediately.",
              },
              {
                icon: "🔒",
                title: "Secure by default",
                desc: "Files are stored with zero visible infrastructure. No traces.",
              },
              {
                icon: "{}",
                title: "Developer API",
                desc: "Simple REST API. Upload and retrieve files from any app.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card"
                style={{ borderRadius: 0, border: "none" }}
              >
                <div style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
                  {f.icon}
                </div>
                <h3 style={{ marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "0.8125rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* api preview */}
        <div id="api" style={{ marginTop: "5rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Simple API</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Integrate in minutes. Upload from any language or framework.
          </p>
          <div
            className="code-block"
            style={{ fontSize: "0.8rem", lineHeight: 1.8 }}
          >
            <div style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              # Upload a file
            </div>
            <div>
              <span style={{ color: "var(--accent)" }}>POST</span>
              <span style={{ color: "var(--text)" }}>
                {" "}
                https://api.idata.dev/v1/upload
              </span>
            </div>
            <div
              style={{
                color: "var(--text-muted)",
                marginTop: "0.75rem",
                marginBottom: "0.25rem",
              }}
            >
              # Response
            </div>
            <div
              style={{ color: "var(--text-secondary)" }}
            >{`{ "fileId": "abc123", "url": "https://api.idata.dev/v1/download/abc123" }`}</div>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          iData © 2026 · Built for the future
        </span>
      </footer>
    </main>
  );
}
