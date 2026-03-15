import type { FastifyInstance } from "fastify";
import { User } from "../models/User.js";

export async function userRoutes(server: FastifyInstance) {
  server.get(
    "/me",
    { onRequest: [(server as any).authenticate] },
    async (request, reply) => {
      const { id } = request.user as { id: string };
      const user = await User.findById(id).select("-password");
      if (!user) return reply.status(404).send({ error: "User not found" });

      return reply.send({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        plan: user.plan,
        storage: {
          used: user.usedStorage,
          limit: user.storageLimit,
          remaining: user.storageLimit - user.usedStorage,
          percent: Math.round((user.usedStorage / user.storageLimit) * 100),
        },
      });
    },
  );
}
