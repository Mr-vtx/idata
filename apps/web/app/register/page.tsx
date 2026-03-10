"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { useStore } from "../../lib/store";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!username || !email || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/v1/auth/register", {
        username,
        email,
        password,
      });
      setUser({ username: res.data.username, token: res.data.token });
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "2.5rem",
            width: "fit-content",
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
          <span style={{ fontWeight: 700, fontSize: "1rem" }}>Data</span>
        </Link>

        <div className="card">
          <h2 style={{ marginBottom: "0.375rem" }}>Create account</h2>
          <p style={{ fontSize: "0.8125rem", marginBottom: "1.5rem" }}>
            Start storing files for free
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.375rem",
                }}
              >
                Username
              </label>
              <input
                className="input"
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.375rem",
                }}
              >
                Email
              </label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.375rem",
                }}
              >
                Password
              </label>
              <input
                className="input"
                type="password"
                placeholder="min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", marginTop: "0.25rem" }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}
        >
          Have an account?{" "}
          <Link
            href="/login"
            style={{ color: "var(--accent)", fontWeight: 500 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
