import DocsLayout from "../../components/DocsLayout";

export default function JsSDK() {
  return (
    <DocsLayout>
      <h1>JavaScript / Node.js SDK</h1>
      <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
        The official iData JavaScript SDK works in Node.js and the browser.
      </p>

      <div className="docs-warning">
        ⚠️ SDK coming soon — use the REST API directly for now.
      </div>

      <h2>Installation</h2>
      <pre>
        <code>npm install idata-sdk</code>
      </pre>

      <h2>Initialize</h2>
      <pre>
        <code>{`import { iData } from "idata-sdk";
const client = new iData("id_live_YOUR_API_KEY");`}</code>
      </pre>

      <h2>Upload a file</h2>
      <pre>
        <code>{`// Node.js
import { readFileSync } from "fs";
const buffer = readFileSync("./movie.mp4");
const file = await client.upload(buffer, "movie.mp4");
console.log(file.url);
// https://api.idata.dev/v1/download/64abc123def456`}</code>
      </pre>

      <h2>Upload from browser</h2>
      <pre>
        <code>{`// Browser (file input)
const input = document.querySelector('input[type="file"]');
const file = input.files[0];
const result = await client.upload(file);
console.log(result.url);`}</code>
      </pre>

      <h2>Get download URL</h2>
      <pre>
        <code>{`const url = client.getUrl("64abc123def456");
// https://api.idata.dev/v1/download/64abc123def456`}</code>
      </pre>

      <h2>Using with REST API directly</h2>
      <p>Until the SDK is published, use the REST API with fetch:</p>
      <pre>
        <code>{`const formData = new FormData();
formData.append("file", file);

const res = await fetch("https://api.idata.dev/v1/upload", {
  method: "POST",
  headers: { "Authorization": "Bearer id_live_YOUR_KEY" },
  body: formData
});

const { url, fileId } = await res.json();`}</code>
      </pre>
    </DocsLayout>
  );
}
