import type { FastifyInstance } from "fastify";
import { uploadFile } from "@repo/core";
import { File } from "../models/File.js";
import { createWriteStream, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { pipeline } from "stream/promises";
import { validateApiKey } from "../middleware/apiKeyAuth.js";

export async function uploadRoutes(server: FastifyInstance) {
  server.post("/upload", async (request, reply) => {
    let userId: string | null = null;

    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      if (token?.startsWith("id_live_")) {
        userId = await validateApiKey(token);
      } else {
        try {
          const decoded = (await request.jwtVerify()) as { id: string };
          userId = decoded.id;
        } catch {}
      }
    }

    if (!userId) {
      return reply
        .status(401)
        .send({ error: "Unauthorized — provide a Bearer JWT or API key" });
    }

    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: "No file provided" });
    }

    const tmpPath = join(tmpdir(), `idata_${Date.now()}_${data.filename}`);
    await pipeline(data.file, createWriteStream(tmpPath));

    try {
      const result = await uploadFile(tmpPath, data.filename, data.mimetype);

      const file = await File.create({
        userId,
        fileName: result.fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
        messageId: result.messageId,
      });

      return reply.send({
        success: true,
        fileId: file._id,
        fileName: file.fileName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        url: `${process.env.API_URL || "http://localhost:3001"}/v1/download/${file._id}`,
      });
    } finally {
      try {
        unlinkSync(tmpPath);
      } catch {}
    }
  });

  server.get(
    "/files",
    { onRequest: [(server as any).authenticate] },
    async (request, reply) => {
      const user = request.user as { id: string };
      const files = await File.find({ userId: user.id }).sort({
        createdAt: -1,
      });
      return reply.send({ files });
    },
  );
}
