import type { FastifyInstance } from "fastify";
import { downloadFile } from "@repo/core";
import { File } from "../models/File.js";
import { existsInR2, streamFromR2, uploadStreamToR2 } from "../lib/r2.js";
import { PassThrough } from "stream";

export async function downloadRoutes(server: FastifyInstance) {
  server.get<{ Params: { fileId: string }; Querystring: { dl?: string } }>(
    "/download/:fileId",
    async (request, reply) => {
      const { fileId } = request.params;
      const dl = request.query.dl === "1";

      const file = await File.findById(fileId);
      if (!file) {
        return reply.status(404).send({ error: "File not found" });
      }

      reply
        .header("Content-Type", file.mimeType)
        .header(
          "Content-Disposition",
          `${dl ? "attachment" : "inline"}; filename="${file.fileName}"`,
        )
        .header("Content-Length", file.fileSize)
        .header("Accept-Ranges", "bytes")
        .header("Cache-Control", "public, max-age=86400");

      const r2Key = `files/${fileId}`;

      if (await existsInR2(r2Key)) {
        server.log.info(`R2 cache hit: ${fileId}`);
        const { stream } = await streamFromR2(r2Key);
        return reply.send(stream);
      }

      server.log.info(`R2 cache miss: ${fileId} — streaming from Telegram`);

      const buffer = await downloadFile(file.messageId);

      const r2Stream = new PassThrough();
      r2Stream.end(buffer);
      uploadStreamToR2(r2Key, r2Stream, file.mimeType, buffer.length)
        .then(() => server.log.info(`R2 cached: ${fileId}`))
        .catch((err) => server.log.error(`R2 upload failed: ${err}`));

      return reply.send(buffer);
    },
  );
}
