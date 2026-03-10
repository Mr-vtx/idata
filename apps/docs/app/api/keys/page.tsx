import Sidebar from "../../components/Sidebar";
import EndpointCard from "../../components/EndpointCard";

export default function KeysDoc() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "3rem", maxWidth: "760px" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>API Keys</h1>
        <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
          Manage API keys for authenticating programmatic access to the iData API.
        </p>

        <EndpointCard
          method="POST"
          path="/v1/keys/generate"
          description="Generate a new API key. The full key is only returned once — store it securely."
          auth="jwt"
          body={[
            { name: "name", type: "string", required: true, description: "A label for this key e.g. 'Production', 'My App'." },
          ]}
          example={`curl -X POST https://api.idata.dev/v1/keys/generate \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Production"}'`}
          response={`{
  "id": "64abc123def456",
  "name": "Production",
  "key": "id_live_a1b2c3d4e5f6...",
  "prefix": "id_live_a1b2c3...",
  "createdAt": "2026-03-09T14:49:32.498Z"
}`}
        />

        <EndpointCard
          method="GET"
          path="/v1/keys"
          description="List all API keys for the authenticated user. Full key values are never returned after creation."
          auth="jwt"
          example={`curl https://api.idata.dev/v1/keys \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
          response={`{
  "keys": [
    {
      "id": "64abc123def456",
      "name": "Production",
      "prefix": "id_live_a1b2c3...",
      "isActive": true,
      "lastUsed": "2026-03-09T14:49:32.498Z",
      "createdAt": "2026-03-09T14:49:32.498Z"
    }
  ]
}`}
        />

        <EndpointCard
          method="DELETE"
          path="/v1/keys/:keyId"
          description="Revoke an API key. Once revoked, the key can no longer be used to authenticate."
          auth="jwt"
          params={[
            { name: "keyId", type: "string", required: true, description: "The ID of the API key to revoke." },
          ]}
          example={`curl -X DELETE https://api.idata.dev/v1/keys/64abc123def456 \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
          response={`{
  "success": true,
  "message": "Key revoked"
}`}
        />
      </main>
    </div>
  );
}
