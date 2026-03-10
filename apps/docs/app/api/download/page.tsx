import Sidebar from "../../components/Sidebar";
import EndpointCard from "../../components/EndpointCard";

export default function DownloadDoc() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "3rem", maxWidth: "760px" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Download File</h1>
        <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
          Download a file by its ID. This endpoint is public — no authentication required.
        </p>

        <EndpointCard
          method="GET"
          path="/v1/download/:fileId"
          description="Stream a file directly. The file is returned as a binary stream with the correct Content-Type header."
          auth="none"
          params={[
            { name: "fileId", type: "string", required: true, description: "The MongoDB ID of the file returned from the upload endpoint." },
          ]}
          example={`# Download directly
curl https://api.idata.dev/v1/download/64abc123def456 -o movie.mp4

# Embed in HTML
<video src="https://api.idata.dev/v1/download/64abc123def456" controls />`}
          response={`// Binary file stream
// Headers:
Content-Type: video/mp4
Content-Disposition: attachment; filename="movie.mp4"
Content-Length: 278610789`}
        />

        <h2>Notes</h2>
        <p>The download URL never exposes where the file is actually stored. You can safely share these URLs publicly.</p>
      </main>
    </div>
  );
}
