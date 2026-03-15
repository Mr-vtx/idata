import DocsLayout from "../../../components/DocsLayout";
import EndpointCard from "../../../components/EndpointCard";

export default function RegisterDoc() {
  return (
    <DocsLayout>
      <h1>Register</h1>
      <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
        Create a new user account.
      </p>

      <EndpointCard
        method="POST"
        path="/v1/auth/register"
        description="Create a new account. Returns a JWT token on success."
        auth="none"
        body={[
          {
            name: "username",
            type: "string",
            required: true,
            description: "Unique username, minimum 3 characters.",
          },
          {
            name: "email",
            type: "string",
            required: true,
            description: "Valid email address.",
          },
          {
            name: "password",
            type: "string",
            required: true,
            description: "Password, minimum 6 characters.",
          },
        ]}
        example={`curl -X POST https://api.idata.dev/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "vans",
    "email": "vans@example.com",
    "password": "securepassword"
  }'`}
        response={`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "vans"
}`}
      />
    </DocsLayout>
  );
}
