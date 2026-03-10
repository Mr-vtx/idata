import type { FastifyInstance } from "fastify";
import { downloadFile } from "@repo/core";
import { File } from "../models/File.js";

export async function downloadRoutes(server: FastifyInstance) {
  server.get<{ Params: { fileId: string } }>(
    "/download/:fileId",
    async (request, reply) => {
      const { fileId } = request.params;

      // lookup messageId from MongoDB
      const file = await File.findById(fileId);
      if (!file) {
        return reply.status(404).send({ error: "File not found" });
      }

      // fetch from Telegram (user never knows)
      const buffer = await downloadFile(file.messageId);

      return reply
        .header("Content-Type", file.mimeType)
        .header(
          "Content-Disposition",
          `attachment; filename="${file.fileName}"`,
        )
        .header("Content-Length", file.fileSize)
        .send(buffer);
    },
  );
}
