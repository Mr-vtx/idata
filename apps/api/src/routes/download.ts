import type { FastifyInstance } from "fastify";
import { downloadFile } from "@repo/core";
import { File } from "../models/File.js";
import { existsInR2, uploadToR2, getFromR2 } from "../lib/r2.js";

export async function downloadRoutes(server: FastifyInstance) {
  server.get<{ Params: { fileId: string } }>(
    "/download/:fileId",
    async (request, reply) => {
      const { fileId } = request.params;

      const file = await File.findById(fileId);
      if (!file) {
        return reply.status(404).send({ error: "File not found" });
      }

      reply
        .header("Content-Type", file.mimeType)
        .header("Content-Disposition", `inline; filename="${file.fileName}"`)
        .header("Content-Length", file.fileSize)
        .header("Accept-Ranges", "bytes")
        .header("Cache-Control", "public, max-age=86400");

      const r2Key = `files/${fileId}`;

      if (await existsInR2(r2Key)) {
        server.log.info(`R2 cache hit: ${fileId}`);
        const buffer = await getFromR2(r2Key);
        return reply.send(buffer);
      }

      server.log.info(`R2 cache miss: ${fileId} — fetching from Telegram`);
      const buffer = await downloadFile(file.messageId);

      uploadToR2(r2Key, buffer, file.mimeType).catch((err) =>
        server.log.error(`R2 upload failed: ${err}`)
      );

      return reply.send(buffer);
    },
  );
}