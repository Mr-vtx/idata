import type { FastifyInstance } from "fastify";
import { ApiKey, generateApiKey } from "../models/ApiKey.js";
import { z } from "zod";

const createKeySchema = z.object({
  name: z.string().min(1).max(50),
});

export async function keyRoutes(server: FastifyInstance) {
  server.post(
    "/keys/generate",
    { onRequest: [(server as any).authenticate] },
    async (request, reply) => {
      const body = createKeySchema.safeParse(request.body);
      if (!body.success) {
        return reply.status(400).send({ error: body.error.flatten() });
      }

      const user = request.user as { id: string };
      const { key, prefix } = generateApiKey();

      const apiKey = await ApiKey.create({
        userId: user.id,
        name: body.data.name,
        key,
        keyPrefix: prefix,
      });

   return reply.status(201).send({
     id: apiKey._id.toString(),
     name: apiKey.name,
     key,
     prefix: apiKey.keyPrefix,
     createdAt: apiKey.createdAt,
   });
    },
  );

  server.get(
    "/keys",
    { onRequest: [(server as any).authenticate] },
    async (request, reply) => {
      const user = request.user as { id: string };
      const keys = await ApiKey.find({ userId: user.id }).sort({ createdAt: -1 });

      return reply.send({
        keys: keys.map((k) => ({
          id: k._id.toString(), 
          name: k.name,
          prefix: k.keyPrefix,
          isActive: k.isActive,
          lastUsed: k.lastUsed,
          createdAt: k.createdAt,
          revokedAt: k.revokedAt,
        })),
      });
    },
  );

  server.delete(
    "/keys/:keyId",
    { onRequest: [(server as any).authenticate] },
    async (request, reply) => {
      const user = request.user as { id: string };
      const { keyId } = request.params as { keyId: string };

      const key = await ApiKey.findOneAndUpdate(
        { _id: keyId, userId: user.id },
        { isActive: false, revokedAt: new Date() },
        { new: true },
      );

      if (!key) {
        return reply.status(404).send({ error: "Key not found" });
      }

      return reply.send({ success: true, message: "Key revoked" });
    },
  );
}
