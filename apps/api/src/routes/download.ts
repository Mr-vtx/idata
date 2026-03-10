import type { FastifyInstance } from "fastify";
import { downloadFile } from "@repo/core";
import { File } from "../models/File.js";
import { createReadStream, existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const CACHE_DIR = join(tmpdir(), "idata_cache");
mkdirSync(CACHE_DIR, { recursive: true });

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
        .header("Cache-Control", "public, max-age=3600");

      const cachePath = join(CACHE_DIR, fileId);

      if (existsSync(cachePath)) {
        return reply.send(createReadStream(cachePath));
      }

      const buffer = await downloadFile(file.messageId);
      await writeFile(cachePath, buffer);
      return reply.send(createReadStream(cachePath));
    },
  );
}
