import DocsLayout from "../components/DocsLayout";

export default function Authentication() {
  return (
    <DocsLayout>
      <h1>Authentication</h1>
      <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
        iData uses Bearer token authentication. You can authenticate with either
        a JWT token or an API key.
      </p>

      <h2>API Keys (recommended)</h2>
      <p>
        API keys are the recommended way to authenticate for server-side and
        third-party integrations. Generate one from your{" "}
        <a href="https://idata.dev/dashboard/keys">dashboard</a>.
      </p>
      <pre>
        <code>{`Authorization: Bearer id_live_xxxxxxxxxxxxxxxx`}</code>
      </pre>

      <h2>JWT Tokens</h2>
      <p>
        JWT tokens are returned when you log in via the API. They're best for
        user-facing applications where the user is already authenticated.
      </p>
      <pre>
        <code>{`// 1. Login to get a token
POST /v1/auth/login
{ "email": "you@example.com", "password": "yourpassword" }

// 2. Use the token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</code>
      </pre>

      <h2>Which should I use?</h2>
      <div className="docs-auth-grid">
        {[
          {
            title: "API Key",
            points: [
              "Server-side apps",
              "CLI tools",
              "Third-party integrations",
              "Long-lived access",
            ],
          },
          {
            title: "JWT Token",
            points: [
              "User-facing web apps",
              "Mobile apps",
              "Short-lived sessions",
              "Per-user access",
            ],
          },
        ].map((item) => (
          <div key={item.title} className="docs-auth-card">
            <div className="docs-auth-card-title">{item.title}</div>
            {item.points.map((p) => (
              <div key={p} className="docs-auth-point">
                → {p}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2>Errors</h2>
      <p>
        If authentication fails, the API returns a <code>401</code> response:
      </p>
      <pre>
        <code>{`{
  "error": "Unauthorized — provide a Bearer JWT or API key"
}`}</code>
      </pre>
    </DocsLayout>
  );
}
