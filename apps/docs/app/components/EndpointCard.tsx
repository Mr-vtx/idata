interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Props {
  method: "GET" | "POST" | "DELETE";
  path: string;
  description: string;
  auth?: "jwt" | "apikey" | "both" | "none";
  params?: Param[];
  body?: Param[];
  example?: string;
  response?: string;
}

const authLabels: Record<string, string> = {
  jwt: "JWT required",
  apikey: "API Key required",
  both: "JWT or API Key",
  none: "Public",
};

export default function EndpointCard({
  method,
  path,
  description,
  auth = "none",
  params,
  body,
  example,
  response,
}: Props) {
  return (
    <div className="endpoint-card">
      {/* Header */}
      <div className="endpoint-header">
        <span className={`badge badge-${method.toLowerCase()}`}>{method}</span>
        <code className="endpoint-path">{path}</code>
        {auth && (
          <span className={`endpoint-auth endpoint-auth--${auth}`}>
            {authLabels[auth]}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="endpoint-body">
        <p>{description}</p>

        {/* Request body params */}
        {body && body.length > 0 && (
          <div className="param-section">
            <div className="param-section-label">Request Body</div>
            <div className="param-table">
              {body.map((p) => (
                <div key={p.name} className="param-row">
                  <div className="param-name-col">
                    <span className="param-name">{p.name}</span>
                    {p.required && <span className="param-required">*</span>}
                  </div>
                  <div className="param-type">{p.type}</div>
                  <div className="param-desc">{p.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URL params */}
        {params && params.length > 0 && (
          <div className="param-section">
            <div className="param-section-label">URL Parameters</div>
            <div className="param-table">
              {params.map((p) => (
                <div key={p.name} className="param-row">
                  <div className="param-name-col">
                    <span className="param-name">{p.name}</span>
                  </div>
                  <div className="param-type">{p.type}</div>
                  <div className="param-desc">{p.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example */}
        {example && (
          <div className={response ? "param-section" : ""}>
            <div className="endpoint-code-label">Example Request</div>
            <pre>
              <code>{example}</code>
            </pre>
          </div>
        )}

        {/* Response */}
        {response && (
          <div>
            <div className="endpoint-code-label">Response</div>
            <pre>
              <code>{response}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
