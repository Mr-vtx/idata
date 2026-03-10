import type { FastifyInstance } from "fastify";
import { User } from "../models/User.js";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(server: FastifyInstance) {
  // register
  server.post("/auth/register", async (request, reply) => {
    const body = registerSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() });
    }

    const { username, email, password } = body.data;

    const exists = await User.findOne({ email });
    if (exists) {
      return reply.status(409).send({ error: "Email already registered" });
    }

    const user = await User.create({ username, email, password });
    const token = server.jwt.sign({ id: user._id, email: user.email });

    return reply.status(201).send({ token, username: user.username });
  });

  // login
  server.post("/auth/login", async (request, reply) => {
    const body = loginSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() });
    }

    const { email, password } = body.data;

    const user = await User.findOne({ email });
    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const valid = await (user as any).comparePassword(password);
    if (!valid) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = server.jwt.sign({ id: user._id, email: user.email });
    return reply.send({ token, username: user.username });
  });
}
