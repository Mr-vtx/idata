import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { uploadRoutes } from "./routes/upload.js";
import { downloadRoutes } from "./routes/download.js";
import { authRoutes } from "./routes/auth.js";
import { keyRoutes } from "./routes/keys.js";

dotenv.config();

const server = Fastify({ logger: true });

await server.register(cors, { origin: "*" });
await server.register(jwt, { secret: process.env.JWT_SECRET! });
await server.register(rateLimit, { max: 100, timeWindow: "1 minute" });
await server.register(multipart, {
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
});

server.server.setTimeout(10 * 60 * 1000);

// define authenticate as a named function BEFORE decorating
async function authenticate(request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ error: "Unauthorized" });
  }
}

server.decorate("authenticate", authenticate);

// routes
server.get("/health", async () => ({ status: "ok" }));
await server.register(authRoutes, { prefix: "/v1" });
await server.register(uploadRoutes, { prefix: "/v1" });
await server.register(downloadRoutes, { prefix: "/v1" });
await server.register(keyRoutes, { prefix: "/v1" });

try {
  await connectDB();
  await server.listen({
    port: Number(process.env.PORT) || 3001,
    host: "0.0.0.0",
  });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
