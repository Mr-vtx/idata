import Sidebar from "../../components/Sidebar";
import EndpointCard from "../../components/EndpointCard";

export default function UploadDoc() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "3rem", maxWidth: "760px" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Upload File</h1>
        <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
          Upload any file up to 2GB. Files are stored securely and a download URL is returned immediately.
        </p>

        <EndpointCard
          method="POST"
          path="/v1/upload"
          description="Upload a file using multipart/form-data. Returns a fileId and public download URL."
          auth="both"
          body={[
            { name: "file", type: "File", required: true, description: "The file to upload. Any format, up to 2GB." },
          ]}
          example={`curl -X POST https://api.idata.dev/v1/upload \\
  -H "Authorization: Bearer id_live_YOUR_KEY" \\
  -F "file=@/path/to/movie.mp4"`}
          response={`{
  "success": true,
  "fileId": "64abc123def456",
  "fileName": "movie.mp4",
  "fileSize": 278610789,
  "mimeType": "video/mp4",
  "url": "https://api.idata.dev/v1/download/64abc123def456"
}`}
        />

        <h2>Notes</h2>
        <p>The returned <code>url</code> is publicly accessible — no authentication required to download. Store the <code>fileId</code> in your database to reference the file later.</p>
      </main>
    </div>
  );
}
