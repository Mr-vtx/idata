import type { FastifyInstance } from "fastify";
import { downloadFileStream } from "@repo/core";
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

      // ── R2 cache hit — stream directly, never touches Telegram ──
      if (await existsInR2(r2Key)) {
        server.log.info(`R2 cache hit: ${fileId}`);
        const { stream } = await streamFromR2(r2Key);
        return reply.send(stream);
      }

      // ── R2 cache miss — stream from Telegram in chunks ──
      server.log.info(`R2 cache miss: ${fileId} — streaming from Telegram`);

      const { stream: telegramStream } = await downloadFileStream(
        file.messageId,
      );

      const userStream = new PassThrough();
      const r2Stream = new PassThrough();

      telegramStream.pipe(userStream);
      telegramStream.pipe(r2Stream);

      uploadStreamToR2(r2Key, r2Stream, file.mimeType, file.fileSize)
        .then(() => server.log.info(`R2 cached: ${fileId}`))
        .catch((err) => server.log.error(`R2 upload failed: ${err}`));

      return reply.send(userStream);
    },
  );
}
