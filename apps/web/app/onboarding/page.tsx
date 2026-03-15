"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "../../lib/store";

const steps = [
  {
    number: "01",
    tag: "Upload",
    title: "Drop any file,\nget a link.",
    description:
      "Upload videos, docs, images — anything up to 2GB. iData stores it securely with zero visible infrastructure.",
    cta: "Got it",
  },
  {
    number: "02",
    tag: "Share",
    title: "One URL.\nWorks everywhere.",
    description:
      "Every file gets a permanent download URL instantly. Share it in emails, apps, or APIs — it just works.",
    cta: "Next",
  },
  {
    number: "03",
    tag: "Integrate",
    title: "Two lines.\nAny language.",
    description:
      "Use your API key to upload from any app or script. Our REST API is dead simple — no SDKs required.",
    cta: "Go to dashboard →",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const goTo = (next: number, dir: "forward" | "back" = "forward") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 280);
  };

  const handleCta = () => {
    if (step < steps.length - 1) {
      goTo(step + 1, "forward");
    } else {
      localStorage.setItem("idata_onboarded", "true");
      router.push("/dashboard");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("idata_onboarded", "true");
    router.push("/dashboard");
  };

const current = steps[step] ?? steps[0]!;  const visuals = [
    <UploadVisual key="upload" />,
    <LinkVisual key="link" />,
    <ApiVisual key="api" />,
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.75rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "26px",
              height: "26px",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 800,
            }}
          >
            i
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "var(--text)",
              letterSpacing: "-0.04em",
            }}
          >
            Data
          </span>
        </Link>

        {/* Step dots */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > step ? "forward" : "back")}
              style={{
                width: i === step ? "24px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === step ? "var(--accent)" : "var(--border)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={handleSkip}
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
            borderRadius: "6px",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "var(--text)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-muted)")
          }
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
          padding: "0 1.75rem",
          gap: "4rem",
          alignItems: "center",
        }}
        className="onboarding-grid"
      >
        {/* Left — text */}
        <div
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === "forward"
                ? "translateX(-20px)"
                : "translateX(20px)"
              : "translateX(0)",
            transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.1em",
                opacity: 0.7,
              }}
            >
              {current.number}
            </span>
            <span
              style={{
                width: "24px",
                height: "1px",
                background: "var(--accent)",
                opacity: 0.4,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {current.tag}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "var(--text)",
              marginBottom: "1.25rem",
              whiteSpace: "pre-line",
            }}
          >
            {current.title}
          </h1>

          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "380px",
              marginBottom: "2.5rem",
            }}
          >
            {current.description}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={handleCta}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.7rem 1.5rem",
                borderRadius: "10px",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow:
                  "0 4px 14px color-mix(in srgb, var(--accent) 30%, transparent)",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              {current.cta}
            </button>

            {step > 0 && (
              <button
                onClick={() => goTo(step - 1, "back")}
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-muted)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text-muted)")
                }
              >
                ← Back
              </button>
            )}
          </div>

          <p
            style={{
              marginTop: "2rem",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            {step + 1} of {steps.length}
          </p>
        </div>

        {/* Right — visual */}
        <div
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === "forward"
                ? "translateX(20px) scale(0.97)"
                : "translateX(-20px) scale(0.97)"
              : "translateX(0) scale(1)",
            transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="onboarding-visual"
        >
          {visuals[step]}
        </div>
      </div>

      {/* Bottom hint */}
      <div
        style={{
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border)",
        }}
      >
        You can revisit this guide anytime from your dashboard settings.
      </div>

      <style>{`
        @media (max-width: 768px) {
          .onboarding-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
          .onboarding-visual {
            order: -1;
          }
        }
      `}</style>
    </main>
  );
}

function UploadVisual() {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const simulate = () => {
    if (active || done) return;
    setActive(true);
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setDone(true), 300);
        setTimeout(() => {
          setDone(false);
          setActive(false);
          setProgress(0);
        }, 3000);
      } else {
        setProgress(p);
      }
    }, 120);
  };

  return (
    <div
      onClick={simulate}
      style={{
        width: "100%",
        maxWidth: "420px",
        borderRadius: "16px",
        border: `2px dashed ${active ? "var(--accent)" : "var(--border)"}`,
        background: active
          ? "color-mix(in srgb, var(--accent) 4%, var(--surface))"
          : "var(--surface)",
        padding: "2.5rem 2rem",
        cursor: "pointer",
        transition: "all 0.3s",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          background: done
            ? "color-mix(in srgb, #22c55e 15%, transparent)"
            : "color-mix(in srgb, var(--accent) 12%, transparent)",
          border: `1px solid ${
            done
              ? "color-mix(in srgb, #22c55e 30%, transparent)"
              : "color-mix(in srgb, var(--accent) 25%, transparent)"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          marginBottom: "1.25rem",
          transition: "all 0.3s",
        }}
      >
        {done ? "✓" : active ? "⬆" : "↑"}
      </div>

      <p
        style={{
          fontWeight: 600,
          fontSize: "0.9375rem",
          color: "var(--text)",
          marginBottom: "0.35rem",
        }}
      >
        {done
          ? "Upload complete!"
          : active
            ? "Uploading..."
            : "Click to simulate upload"}
      </p>
      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
        {done
          ? "Your file is ready to share"
          : active
            ? `${Math.round(progress)}%`
            : "video.mp4 · 847 MB"}
      </p>

      {(active || done) && (
        <div
          style={{
            marginTop: "1.25rem",
            height: "4px",
            borderRadius: "2px",
            background: "var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: done ? "#22c55e" : "var(--accent)",
              borderRadius: "2px",
              transition: "width 0.15s ease, background 0.3s",
            }}
          />
        </div>
      )}

      {!active && !done && (
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}>
          {["mp4", "png", "pdf"].map((ext) => (
            <span
              key={ext}
              style={{
                fontSize: "0.65rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                background: "var(--surface-2)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              {ext}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function LinkVisual() {
  const [copied, setCopied] = useState(false);
  const url = "https://idata-8jhr.onrender.com/v1/download/abc123xyz";

  const copy = () => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ width: "100%", maxWidth: "420px" }}>
      <div
        style={{
          borderRadius: "14px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            padding: "0.625rem 1rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <span
              key={c}
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
                display: "inline-block",
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              fontFamily: "monospace",
            }}
          >
            Download link
          </span>
        </div>

        <div style={{ padding: "1.25rem" }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              wordBreak: "break-all",
              lineHeight: 1.6,
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: "8px",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ color: "var(--accent)" }}>GET</span>{" "}
            <span style={{ color: "var(--text)" }}>/v1/download/</span>
            <span style={{ color: "#f59e0b" }}>abc123xyz</span>
          </div>

          <button
            onClick={copy}
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: "8px",
              border: `1px solid ${copied ? "color-mix(in srgb, #22c55e 40%, transparent)" : "var(--border)"}`,
              background: copied
                ? "color-mix(in srgb, #22c55e 8%, transparent)"
                : "transparent",
              color: copied ? "#22c55e" : "var(--text-secondary)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            {copied ? "✓ Copied!" : "Copy link"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.5rem",
        }}
      >
        {[
          { label: "Email", icon: "✉" },
          { label: "Slack", icon: "⚡" },
          { label: "API", icon: "{}" },
        ].map(({ label, icon }) => (
          <div
            key={label}
            style={{
              padding: "0.75rem 0.5rem",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "1.1rem",
                marginBottom: "0.3rem",
                opacity: 0.6,
              }}
            >
              {icon}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApiVisual() {
  return (
    <div style={{ width: "100%", maxWidth: "440px" }}>
      <div
        style={{
          borderRadius: "14px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "0.625rem 1rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "var(--surface-2)",
          }}
        >
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <span
              key={c}
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
                display: "inline-block",
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              fontFamily: "monospace",
            }}
          >
            upload.sh
          </span>
        </div>

        <div
          style={{
            padding: "1.25rem 1.5rem",
            fontFamily: "monospace",
            fontSize: "0.78rem",
            lineHeight: 2,
          }}
        >
          {[
            { text: "# Upload any file via API", color: "var(--text-muted)" },
            { text: "" },
            { text: "curl -X POST \\", color: "var(--text)" },
            {
              text: "  https://idata-8jhr.onrender.com/v1/upload \\",
              color: "var(--text-secondary)",
            },
            {
              text: '  -H "Authorization: Bearer YOUR_KEY" \\',
              color: "#f59e0b",
            },
            { text: '  -F "file=@movie.mp4"', color: "var(--accent)" },
            { text: "" },
            { text: "# Response:", color: "var(--text-muted)" },
            { text: "{", color: "var(--text-secondary)" },
            {
              text: '  "url": "https://…/v1/download/abc123"',
              color: "#22c55e",
            },
            { text: "}", color: "var(--text-secondary)" },
          ].map((line, i) => (
            <div
              key={i}
              style={{
                color: line.color || "transparent",
                animation: `fadeInLine 0.3s ease ${i * 0.06}s both`,
              }}
            >
              {line.text || "\u00A0"}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "0.75rem",
          padding: "0.75rem 1rem",
          borderRadius: "10px",
          border:
            "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
          background: "color-mix(in srgb, var(--accent) 5%, transparent)",
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
        }}
      >
        <span style={{ fontSize: "0.9rem" }}>⌘</span>
        <div>
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: "0.1rem",
            }}
          >
            Get your API key
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Dashboard → API Keys → Generate new key
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
