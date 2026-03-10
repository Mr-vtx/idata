import Sidebar from "../components/Sidebar";

export default function Authentication() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "3rem", maxWidth: "760px" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Authentication</h1>
        <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
          iData uses Bearer token authentication. You can authenticate with either a JWT token or an API key.
        </p>

        <h2>API Keys (recommended)</h2>
        <p>API keys are the recommended way to authenticate for server-side and third-party integrations. Generate one from your <a href="https://idata.dev/dashboard/keys">dashboard</a>.</p>
        <pre><code>{`Authorization: Bearer id_live_xxxxxxxxxxxxxxxx`}</code></pre>

        <h2>JWT Tokens</h2>
        <p>JWT tokens are returned when you log in via the API. They're best for user-facing applications where the user is already authenticated.</p>
        <pre><code>{`// 1. Login to get a token
POST /v1/auth/login
{ "email": "you@example.com", "password": "yourpassword" }

// 2. Use the token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</code></pre>

        <h2>Which should I use?</h2>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "1rem 0 1.5rem",
        }}>
          {[
            { title: "API Key", points: ["Server-side apps", "CLI tools", "Third-party integrations", "Long-lived access"] },
            { title: "JWT Token", points: ["User-facing web apps", "Mobile apps", "Short-lived sessions", "Per-user access"] },
          ].map((item) => (
            <div key={item.title} style={{
              padding: "1.25rem", background: "var(--surface)",
              border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
            }}>
              <div style={{ fontWeight: 600, marginBottom: "0.75rem" }}>{item.title}</div>
              {item.points.map((p) => (
                <div key={p} style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                  → {p}
                </div>
              ))}
            </div>
          ))}
        </div>

        <h2>Errors</h2>
        <p>If authentication fails, the API returns a <code>401</code> response:</p>
        <pre><code>{`{
  "error": "Unauthorized — provide a Bearer JWT or API key"
}`}</code></pre>
      </main>
    </div>
  );
}
