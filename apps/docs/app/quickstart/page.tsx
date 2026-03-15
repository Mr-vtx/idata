import DocsLayout from "../components/DocsLayout";

export default function Quickstart() {
  return (
    <DocsLayout>
      <h1>Quickstart</h1>
      <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
        Upload your first file in under 5 minutes.
      </p>

      <h2>1. Create an account</h2>
      <p>
        Sign up at <a href="https://idata.dev/register">idata.dev/register</a>{" "}
        to get started.
      </p>

      <h2>2. Generate an API key</h2>
      <p>
        Go to your <a href="https://idata.dev/dashboard/keys">dashboard</a> and
        create an API key. Copy it — it's only shown once.
      </p>

      <h2>3. Upload a file</h2>
      <p>
        Use your API key to upload a file via <code>curl</code> or any HTTP
        client:
      </p>
      <pre>
        <code>{`curl -X POST https://api.idata.dev/v1/upload \\
  -H "Authorization: Bearer id_live_YOUR_KEY" \\
  -F "file=@/path/to/your/file.mp4"`}</code>
      </pre>

      <h2>4. Get the download URL</h2>
      <p>
        The response includes a <code>url</code> field — share it, embed it, or
        use it directly:
      </p>
      <pre>
        <code>{`{
  "success": true,
  "fileId": "64abc123def456",
  "fileName": "file.mp4",
  "fileSize": 10485760,
  "mimeType": "video/mp4",
  "url": "https://api.idata.dev/v1/download/64abc123def456"
}`}</code>
      </pre>

      <h2>5. Download the file</h2>
      <p>
        The download URL is public — no auth required. Anyone with the link can
        download it:
      </p>
      <pre>
        <code>{`curl https://api.idata.dev/v1/download/64abc123def456 -o file.mp4`}</code>
      </pre>

      <h2>Next steps</h2>
      <p>
        Check out the <a href="/sdk/javascript">JavaScript SDK</a> or browse the
        full <a href="/api/upload">API reference</a>.
      </p>
    </DocsLayout>
  );
}
