"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ proper import
import Navbar from "../../components/Navbar";
import { useStore } from "../../lib/store";
import api from "../../lib/api";

interface FileItem {
  _id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useStore();
  const router = useRouter();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    fetchFiles();
  }, [user, router]); // ✅ proper deps

  const fetchFiles = async () => {
    try {
      const res = await api.get("/v1/files");
      setFiles(res.data.files);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
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
      `${process.env.NEXT_PUBLIC_API_URL}/v1/download/${id}`,
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
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "0.25rem" }}>Files</h1>
            <p style={{ fontSize: "0.8125rem" }}>
              {loading
                ? "Loading..."
                : `${files.length} file${files.length !== 1 ? "s" : ""} stored`}
            </p>
          </div>

          <Link href="/upload" className="btn btn-primary">
            Upload file
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
              padding: "5rem 2rem",
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
              <div
                key={file._id}
                style={{
                  background: "var(--surface)",
                  padding: "0.875rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* icon */}
                <div style={{ fontSize: "1.25rem", flexShrink: 0 }}>
                  {getMimeIcon(file.mimeType)}
                </div>

                {/* info */}
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
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <span className="badge">{formatSize(file.fileSize)}</span>
                    <span className="badge">{file.mimeType}</span>
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

                {/* actions */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => copyLink(file._id)}
                    style={{
                      color: copied === file._id ? "var(--success)" : undefined,
                    }}
                  >
                    {copied === file._id ? "Copied!" : "Copy link"}
                  </button>

                  {/* ✅ FIXED DOWNLOAD LINK */}
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/v1/download/${file._id}?dl=1`}
                    className="btn btn-ghost btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
