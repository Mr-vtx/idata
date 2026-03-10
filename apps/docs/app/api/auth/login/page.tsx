import Sidebar from "../../../components/Sidebar";
import EndpointCard from "../../../components/EndpointCard";

export default function LoginDoc() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "3rem", maxWidth: "760px" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Login</h1>
        <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>Authenticate and receive a JWT token.</p>

        <EndpointCard
          method="POST"
          path="/v1/auth/login"
          description="Login with email and password. Returns a JWT token valid for 7 days."
          auth="none"
          body={[
            { name: "email", type: "string", required: true, description: "Your registered email address." },
            { name: "password", type: "string", required: true, description: "Your password." },
          ]}
          example={`curl -X POST https://api.idata.dev/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "vans@example.com",
    "password": "securepassword"
  }'`}
          response={`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "vans"
}`}
        />
      </main>
    </div>
  );
}
