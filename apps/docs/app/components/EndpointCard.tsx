interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Props {
  method: "GET" | "POST" | "DELETE";
  path: string;
  description: string;
  auth?: "jwt" | "apikey" | "both" | "none";
  params?: Param[];
  body?: Param[];
  example?: string;
  response?: string;
}

const methodColors: Record<string, string> = {
  GET: "badge-get",
  POST: "badge-post",
  DELETE: "badge-delete",
};

const authLabels: Record<string, string> = {
  jwt: "JWT required",
  apikey: "API Key required",
  both: "JWT or API Key",
  none: "Public",
};

const authColors: Record<string, string> = {
  jwt: "rgba(99,102,241,0.1)",
  apikey: "rgba(232,255,71,0.1)",
  both: "rgba(99,102,241,0.1)",
  none: "rgba(34,197,94,0.1)",
};

export default function EndpointCard({ method, path, description, auth = "none", params, body, example, response }: Props) {
  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      marginBottom: "2rem",
    }}>
      {/* header */}
      <div style={{
        padding: "1rem 1.25rem",
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        borderBottom: "1px solid var(--border)",
      }}>
        <span className={`badge badge-${method.toLowerCase()}`}>{method}</span>
        <code style={{
          background: "none",
          border: "none",
          padding: 0,
          fontSize: "0.875rem",
          color: "var(--text)",
          fontWeight: 500,
        }}>
          {path}
        </code>
        {auth && (
          <span style={{
            marginLeft: "auto",
            fontSize: "0.72rem",
            padding: "0.15rem 0.5rem",
            borderRadius: "9999px",
            background: authColors[auth],
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}>
            {authLabels[auth]}
          </span>
        )}
      </div>

      <div style={{ padding: "1.25rem", background: "var(--bg)" }}>
        <p style={{ marginBottom: body || params ? "1.25rem" : 0 }}>{description}</p>

        {/* body params */}
        {body && body.length > 0 && (
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              Request Body
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
              {body.map((p, i) => (
                <div key={p.name} style={{
                  padding: "0.75rem 1rem",
                  borderBottom: i < body.length - 1 ? "1px solid var(--border)" : "none",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  background: "var(--surface)",
                }}>
                  <div style={{ minWidth: "120px" }}>
                    <code style={{ fontSize: "0.8rem" }}>{p.name}</code>
                    {p.required && (
                      <span style={{ color: "var(--error)", fontSize: "0.65rem", marginLeft: "0.25rem" }}>*</span>
                    )}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", minWidth: "60px" }}>{p.type}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>{p.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* url params */}
        {params && params.length > 0 && (
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              URL Parameters
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
              {params.map((p, i) => (
                <div key={p.name} style={{
                  padding: "0.75rem 1rem",
                  borderBottom: i < params.length - 1 ? "1px solid var(--border)" : "none",
                  display: "flex",
                  gap: "1rem",
                  background: "var(--surface)",
                }}>
                  <code style={{ fontSize: "0.8rem", minWidth: "120px" }}>{p.name}</code>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", minWidth: "60px" }}>{p.type}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>{p.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* example */}
        {example && (
          <div style={{ marginBottom: response ? "1.25rem" : 0 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Example Request
            </div>
            <pre><code>{example}</code></pre>
          </div>
        )}

        {/* response */}
        {response && (
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Response
            </div>
            <pre><code>{response}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
}
