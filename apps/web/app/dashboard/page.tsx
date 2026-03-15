"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";

interface FileItem {
  _id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await api.get("/v1/files");
      setFiles(res.data.files);
    } catch {
      // AuthProvider handles redirect if 401
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(`/v1/files/${id}`);
      setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch {
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const copyLink = async (id: string) => {
    await navigator.clipboard.writeText(
      `https://idata-cdn.idata-vans-cdn.workers.dev/files/${id}`,
    );
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getMimeIcon = (mime: string) => {
    if (mime.startsWith("video/")) return "🎬";
    if (mime.startsWith("image/")) return "🖼️";
    if (mime.startsWith("audio/")) return "🎵";
    if (mime.includes("pdf")) return "📄";
    if (mime.includes("zip") || mime.includes("archive")) return "📦";
    return "📁";
  };

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1rem" }}
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
              Files
            </h1>
            <p style={{ fontSize: "0.8125rem" }}>
              {loading
                ? "Loading..."
                : `${files.length} file${files.length !== 1 ? "s" : ""} stored`}
            </p>
          </div>
          <Link
            href="/upload"
            className="btn btn-primary"
            style={{ flexShrink: 0, whiteSpace: "nowrap" }}
          >
            + Upload
          </Link>
        </div>

        <div className="divider" style={{ marginBottom: "1.5rem" }} />

        {/* content */}
        {loading ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: "64px" }} />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1.5rem",
              border: "1px dashed var(--border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📂</div>
            <h3 style={{ marginBottom: "0.5rem" }}>No files yet</h3>
            <p style={{ fontSize: "0.8125rem", marginBottom: "1.5rem" }}>
              Upload your first file to get started
            </p>
            <Link href="/upload" className="btn btn-primary">
              Upload a file
            </Link>
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
            {files.map((file) => (
              <div key={file._id}>
                <div
                  style={{
                    background:
                      confirmDelete === file._id
                        ? "color-mix(in srgb, #ef4444 4%, var(--surface))"
                        : "var(--surface)",
                    padding: "0.875rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{ fontSize: "1.25rem", flexShrink: 0 }}>
                    {getMimeIcon(file.mimeType)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        marginBottom: "0.2rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.fileName}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span className="badge">{formatSize(file.fileSize)}</span>
                      <span className="badge mime-badge">{file.mimeType}</span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {formatDate(file.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}
                  >
                    {/* Copy */}
                    <button
                      onClick={() => copyLink(file._id)}
                      title="Copy link"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "7px",
                        border: `1px solid ${copied === file._id ? "color-mix(in srgb, #22c55e 35%, transparent)" : "var(--border)"}`,
                        background:
                          copied === file._id
                            ? "color-mix(in srgb, #22c55e 10%, transparent)"
                            : "transparent",
                        color:
                          copied === file._id
                            ? "#22c55e"
                            : "var(--text-secondary)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        flexShrink: 0,
                      }}
                    >
                      {copied === file._id ? (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                        >
                          <path
                            d="M2 6.5l3 3 6-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                        >
                          <rect
                            x="4.5"
                            y="4.5"
                            width="7"
                            height="7"
                            rx="1.5"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M1.5 9V2a.5.5 0 01.5-.5h7"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Download */}
                    <a
                      href={`https://idata-cdn.idata-vans-cdn.workers.dev/files/${file._id}`}
                      download={file.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Download"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "7px",
                        border: "1px solid var(--border)",
                        background: "transparent",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        transition: "all 0.15s",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "var(--surface-2)";
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--accent)";
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor =
                          "color-mix(in srgb, var(--accent) 30%, transparent)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "transparent";
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--text-secondary)";
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.borderColor = "var(--border)";
                      }}
                    >
                      <svg
                        width="13"
                        height="14"
                        viewBox="0 0 13 14"
                        fill="none"
                      >
                        <path
                          d="M6.5 1v9M3.5 7l3 3 3-3"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.5 12h10"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                      </svg>
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        setConfirmDelete(
                          confirmDelete === file._id ? null : file._id,
                        )
                      }
                      title="Delete"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "7px",
                        border: `1px solid ${confirmDelete === file._id ? "color-mix(in srgb, #ef4444 35%, transparent)" : "var(--border)"}`,
                        background:
                          confirmDelete === file._id
                            ? "color-mix(in srgb, #ef4444 10%, transparent)"
                            : "transparent",
                        color: "#ef4444",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (confirmDelete !== file._id) {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background =
                            "color-mix(in srgb, #ef4444 8%, transparent)";
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor =
                            "color-mix(in srgb, #ef4444 25%, transparent)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (confirmDelete !== file._id) {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "transparent";
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "var(--border)";
                        }
                      }}
                    >
                      <svg
                        width="12"
                        height="14"
                        viewBox="0 0 12 14"
                        fill="none"
                      >
                        <path
                          d="M1 3.5h10M4 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5 6.5v4M7 6.5v4"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 3.5l.6 7.6a1 1 0 001 .9h4.8a1 1 0 001-.9L10 3.5"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm delete bar */}
                {confirmDelete === file._id && (
                  <div
                    style={{
                      background:
                        "color-mix(in srgb, #ef4444 5%, var(--surface))",
                      borderTop:
                        "1px solid color-mix(in srgb, #ef4444 15%, transparent)",
                      padding: "0.625rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                      animation: "slideDown 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        flex: 1,
                        minWidth: "160px",
                      }}
                    >
                      Delete{" "}
                      <strong style={{ color: "var(--text)" }}>
                        {file.fileName}
                      </strong>
                      ? Cannot be undone.
                    </span>
                    <div
                      style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}
                    >
                      <button
                        onClick={() => setConfirmDelete(null)}
                        style={{
                          padding: "0.3rem 0.75rem",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                          background: "transparent",
                          color: "var(--text-secondary)",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteFile(file._id)}
                        disabled={deleting === file._id}
                        style={{
                          padding: "0.3rem 0.875rem",
                          borderRadius: "6px",
                          border: "none",
                          background: "#ef4444",
                          color: "#fff",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor:
                            deleting === file._id ? "not-allowed" : "pointer",
                          opacity: deleting === file._id ? 0.7 : 1,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        {deleting === file._id ? (
                          <>
                            <div className="spinner spinner-xs spinner-white" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .mime-badge { display: none; }
        }
      `}</style>
    </main>
  );
}
