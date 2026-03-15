"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import api from "../../../lib/api";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  isActive: boolean;
  lastUsed: string | null;
  createdAt: string;
  revokedAt: string | null;
}

export default function ApiKeys() {
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await api.get("/v1/keys");
      setKeys(res.data.keys);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    if (!keyName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await api.post("/v1/keys/generate", { name: keyName });
      setNewKey(res.data.key);
      setKeyName("");
      setShowForm(false);
      await fetchKeys();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to create key");
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (id: string) => {
    setRevoking(id);
    try {
      await api.delete(`/v1/keys/${id}`);
      await fetchKeys();
    } catch {
      setError("Failed to revoke key");
    } finally {
      setRevoking(null);
    }
  };

  const copyKey = async () => {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                marginBottom: "0.25rem",
                fontSize: "clamp(1.25rem, 5vw, 1.75rem)",
              }}
            >
              API Keys
            </h1>
            <p style={{ fontSize: "0.8125rem" }}>
              Authenticate requests to the iData API
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              setNewKey(null);
            }}
            style={{ flexShrink: 0, whiteSpace: "nowrap" }}
          >
            + New key
          </button>
        </div>

        <div className="divider" style={{ marginBottom: "1.5rem" }} />

        {/* new key banner */}
        {newKey && (
          <div
            className="alert alert-success"
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span className="dot dot-green" />
              <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                Key created — copy it now, you won't see it again
              </span>
            </div>
            <div
              style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "var(--radius-sm)",
                padding: "0.75rem 1rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                wordBreak: "break-all",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <span style={{ flex: 1 }}>{newKey}</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={copyKey}
                style={{
                  flexShrink: 0,
                  color: copied ? "var(--success)" : undefined,
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* create form */}
        {showForm && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>New API key</h3>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                className="input"
                placeholder="Key name e.g. Production, My App..."
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createKey()}
                autoFocus
                style={{ flex: 1, minWidth: "160px" }}
              />
              <button
                className="btn btn-primary"
                onClick={createKey}
                disabled={creating || !keyName.trim()}
                style={{ flexShrink: 0 }}
              >
                {creating ? "Creating..." : "Create"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowForm(false);
                  setKeyName("");
                }}
                style={{ flexShrink: 0 }}
              >
                Cancel
              </button>
            </div>
            {error && (
              <div
                className="alert alert-error"
                style={{ marginTop: "0.75rem" }}
              >
                {error}
              </div>
            )}
          </div>
        )}

        {/* keys list */}
        {loading ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {[1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: "72px" }} />
            ))}
          </div>
        ) : keys.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1.5rem",
              border: "1px dashed var(--border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔑</div>
            <h3 style={{ marginBottom: "0.5rem" }}>No API keys yet</h3>
            <p style={{ fontSize: "0.8125rem", marginBottom: "1.5rem" }}>
              Create a key to start integrating iData into your projects
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Create your first key
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            {keys.map((key) => (
              <div
                key={key.id}
                style={{
                  background: "var(--surface)",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  opacity: key.isActive ? 1 : 0.5,
                  flexWrap: "wrap",
                }}
              >
                <span
                  className={`dot ${key.isActive ? "dot-green" : "dot-red"}`}
                  style={{ flexShrink: 0 }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.3rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                      {key.name}
                    </span>
                    {!key.isActive && (
                      <span className="badge badge-error">Revoked</span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <code
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        background: "var(--surface-2)",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {key.prefix}
                    </code>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatDate(key.createdAt)}
                    </span>
                    {key.lastUsed && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Used {formatDate(key.lastUsed)}
                      </span>
                    )}
                    {!key.lastUsed && key.isActive && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Never used
                      </span>
                    )}
                  </div>
                </div>

                {key.isActive && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => revokeKey(key.id)}
                    disabled={revoking === key.id}
                    style={{ flexShrink: 0 }}
                  >
                    {revoking === key.id ? "Revoking..." : "Revoke"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* usage hint */}
        <div className="card" style={{ marginTop: "2rem" }}>
          <h4
            style={{ marginBottom: "0.75rem", color: "var(--text-secondary)" }}
          >
            Using your API key
          </h4>
          <div
            className="code-block"
            style={{ fontSize: "0.75rem", overflowX: "auto" }}
          >
            <div style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              # Upload a file
            </div>
            <div style={{ whiteSpace: "nowrap" }}>
              <span style={{ color: "var(--accent)" }}>curl</span>
              <span style={{ color: "var(--text)" }}>
                {" "}
                -X POST https://idata-8jhr.onrender.com/v1/upload \
              </span>
            </div>
            <div style={{ paddingLeft: "1rem", whiteSpace: "nowrap" }}>
              <span style={{ color: "var(--text-muted)" }}>-H </span>
              <span style={{ color: "var(--highlight)" }}>
                "Authorization: Bearer YOUR_API_KEY"
              </span>
              <span style={{ color: "var(--text)" }}> \</span>
            </div>
            <div style={{ paddingLeft: "1rem", whiteSpace: "nowrap" }}>
              <span style={{ color: "var(--text-muted)" }}>-F </span>
              <span style={{ color: "var(--highlight)" }}>
                "file=@yourfile.mp4"
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
