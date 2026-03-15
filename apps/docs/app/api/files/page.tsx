import DocsLayout from "../../components/DocsLayout";
import EndpointCard from "../../components/EndpointCard";

export default function FilesDoc() {
  return (
    <DocsLayout>
      <h1>List Files</h1>
      <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
        Returns all files uploaded by the authenticated user, sorted by most
        recent.
      </p>

      <EndpointCard
        method="GET"
        path="/v1/files"
        description="List all files belonging to the authenticated user. Returns metadata only — not the file contents."
        auth="jwt"
        example={`curl https://api.idata.dev/v1/files \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
        response={`{
  "files": [
    {
      "_id": "64abc123def456",
      "fileName": "movie.mp4",
      "fileSize": 278610789,
      "mimeType": "video/mp4",
      "createdAt": "2026-03-09T14:49:32.498Z"
    }
  ]
}`}
      />
    </DocsLayout>
  );
}
