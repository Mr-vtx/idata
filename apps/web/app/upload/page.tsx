"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";

interface UploadStats {
  progress: number;
  speed: string;
  uploaded: string;
  total: string;
  eta: string;
}

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastLoadedRef = useRef(0);
  const lastTimeRef = useRef(0);
  const router = useRouter();

  const fmt = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  };

  const fmtSpeed = (bps: number) => {
    if (bps < 1024) return `${bps.toFixed(0)} B/s`;
    if (bps < 1024 ** 2) return `${(bps / 1024).toFixed(1)} KB/s`;
    return `${(bps / 1024 ** 2).toFixed(1)} MB/s`;
  };

  const fmtETA = (s: number) => {
    if (!isFinite(s) || s <= 0) return "—";
    if (s < 60) return `${Math.round(s)}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    lastLoadedRef.current = 0;
    lastTimeRef.current = Date.now();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/v1/upload", formData, {
        onUploadProgress: (e) => {
          const loaded = e.loaded;
          const total = e.total || file.size;
          const now = Date.now();
          const dt = (now - lastTimeRef.current) / 1000;
          const db = loaded - lastLoadedRef.current;
          const speed = dt > 0 ? db / dt : 0;
          const eta = speed > 0 ? (total - loaded) / speed : 0;

          lastLoadedRef.current = loaded;
          lastTimeRef.current = now;

          setStats({
            progress: Math.round((loaded / total) * 100),
            speed: fmtSpeed(speed),
            uploaded: fmt(loaded),
            total: fmt(total),
            eta: fmtETA(eta),
          });
        },
      });
      setResult(res.data);
    } catch (e: any) {
      if (e.response?.status === 401) router.push("/login");
      else setError(e.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/download/${result.fileId}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        <h1 style={{ marginBottom: "0.25rem" }}>Upload file</h1>
        <p style={{ fontSize: "0.8125rem", marginBottom: "2rem" }}>
          Any format · Up to 2GB per file
        </p>

        {!result ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* dropzone */}
            <div
              onClick={() => !uploading && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files[0];
                if (f && !uploading) setFile(f);
              }}
              style={{
                border: `1px dashed ${dragging ? "var(--accent)" : file ? "var(--border-hover)" : "var(--border)"}`,
                borderRadius: "var(--radius-lg)",
                padding: "3rem 2rem",
                textAlign: "center",
                cursor: uploading ? "default" : "pointer",
                background: dragging ? "var(--surface-2)" : "var(--surface)",
                transition: "all var(--transition)",
              }}
            >
              <input
                ref={inputRef}
                type="file"
                style={{ display: "none" }}
                onChange={(e) =>
                  e.target.files?.[0] && setFile(e.target.files[0])
                }
              />

              {file ? (
                <div>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                    📄
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      fontSize: "0.9375rem",
                    }}
                  >
                    {file.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <span className="badge">{fmt(file.size)}</span>
                    <span className="badge">{file.type || "unknown"}</span>
                  </div>
                  {!uploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      style={{
                        marginTop: "0.75rem",
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    ↑
                  </div>
                  <div style={{ fontWeight: 500, marginBottom: "0.25rem" }}>
                    Drop file here
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    or click to browse
                  </div>
                </div>
              )}
            </div>

            {/* progress */}
            {uploading && stats && (
              <div
                className="surface-2"
                style={{ padding: "1.25rem", borderRadius: "var(--radius-md)" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.625rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Uploading
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      color: "var(--highlight)",
                      fontWeight: 500,
                    }}
                  >
                    {stats.progress}%
                  </span>
                </div>
                <div
                  className="progress-track"
                  style={{ marginBottom: "1rem" }}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${stats.progress}%`,
                      background: "var(--highlight)",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  {[
                    { label: "Speed", value: stats.speed },
                    { label: "Uploaded", value: stats.uploaded },
                    { label: "Total", value: stats.total },
                    { label: "ETA", value: stats.eta },
                  ].map((s) => (
                    <div key={s.label}>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: "var(--text)",
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          marginTop: "0.15rem",
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            <button
              className="btn btn-primary btn-lg"
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{ width: "100%" }}
            >
              {uploading ? `Uploading ${stats?.progress ?? 0}%...` : "Upload →"}
            </button>
          </div>
        ) : (
          /* success */
          <div className="card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1.25rem",
              }}
            >
              <span className="dot dot-green" />
              <span className="badge badge-success">Upload complete</span>
            </div>

            <div
              style={{
                fontWeight: 600,
                fontSize: "1rem",
                marginBottom: "0.75rem",
              }}
            >
              {result.fileName}
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1.25rem",
              }}
            >
              <span className="badge">{fmt(result.fileSize)}</span>
              <span className="badge">{result.mimeType}</span>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                }}
              >
                Download URL
              </div>
              <div className="code-block" style={{ color: "var(--accent)" }}>
                {process.env.NEXT_PUBLIC_API_URL}/v1/download/{result.fileId}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn btn-primary" onClick={copyLink}>
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setStats(null);
                }}
              >
                Upload another
              </button>
              <Link href="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
