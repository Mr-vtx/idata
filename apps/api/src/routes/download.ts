import type { FastifyInstance } from "fastify";
import { File } from "../models/File.js";
import { downloadFileStream } from "@repo/core";
import { existsInR2, streamFromR2 } from "../lib/r2.js";
import jwt from "jsonwebtoken";

const CDN_URL =
  process.env.CDN_URL || "https://idata-cdn.idata-vans-cdn.workers.dev";
const JWT_SECRET = process.env.JWT_SECRET!;

function signDownloadToken(payload: {
  fileId: string;
  messageId: number;
  accessHash: string | null;
  fileReference: string | null;
  dcId: number | null;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "5m" });
}

function parseRange(rangeHeader: string | undefined): {
  byteStart?: number;
  byteEnd?: number;
} {
  if (!rangeHeader) return {};
  const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
  if (!match) return {};
  return {
    byteStart: parseInt(match[1], 10),
    byteEnd: match[2] ? parseInt(match[2], 10) + 1 : undefined,
  };
}

async function streamFile(
  reply: any,
  messageId: number,
  mimeType: string,
  fileName: string,
  rangeHeader: string | undefined,
) {
  const { byteStart, byteEnd } = parseRange(rangeHeader);
  const { stream, size } = await downloadFileStream(
    messageId,
    undefined,
    byteStart,
    byteEnd,
  );

  const isPartial = byteStart !== undefined;
  const start = byteStart ?? 0;
  const end = byteEnd ?? size - 1;

  reply.header("Accept-Ranges", "bytes");
  reply.header("Content-Type", mimeType || "application/octet-stream");
  reply.header("Cache-Control", "public, max-age=86400");
  reply.header("Content-Disposition", `inline; filename="${fileName}"`);

  if (isPartial && size > 0) {
    reply.header("Content-Range", `bytes ${start}-${end}/${size}`);
    reply.header("Content-Length", String(end - start + 1));
    reply.status(206);
  } else if (size > 0) {
    reply.header("Content-Length", String(size));
    reply.status(200);
  }

  return reply.send(stream);
}

export async function downloadRoutes(server: FastifyInstance) {
  /**
   * GET /download/:fileId
   * Issues a signed CDN URL and redirects — Render never streams bytes.
   */
  server.get("/download/:fileId", async (request, reply) => {
    const { fileId } = request.params as { fileId: string };

    const file = await File.findById(fileId);
    if (!file) return reply.status(404).send({ error: "File not found" });

    const token = signDownloadToken({
      fileId: file._id.toString(),
      messageId: file.messageId,
      accessHash: file.accessHash ?? null,
      fileReference: file.fileReference ?? null,
      dcId: file.dcId ?? null,
    });

    return reply.redirect(`${CDN_URL}/dl/${token}`);
  });

  /**
   * GET /download/:fileId/info
   * Returns metadata + signed URL without redirecting.
   */
  server.get("/download/:fileId/info", async (request, reply) => {
    const { fileId } = request.params as { fileId: string };

    const file = await File.findById(fileId);
    if (!file) return reply.status(404).send({ error: "File not found" });

    const token = signDownloadToken({
      fileId: file._id.toString(),
      messageId: file.messageId,
      accessHash: file.accessHash ?? null,
      fileReference: file.fileReference ?? null,
      dcId: file.dcId ?? null,
    });

    return reply.send({
      fileName: file.fileName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      url: `${CDN_URL}/dl/${token}`,
    });
  });

  /**
   * GET /stream/:fileId
   * Called by the Cloudflare Worker /files/:fileId route.
   * Looks up messageId from DB by MongoDB _id, then streams from Telegram.
   * Supports Range requests for video seeking.
   */
  server.get("/stream/:fileId", async (request, reply) => {
    const { fileId } = request.params as { fileId: string };

    const file = await File.findById(fileId);
    if (!file) return reply.status(404).send({ error: "File not found" });

    try {
      return await streamFile(
        reply,
        file.messageId,
        file.mimeType,
        file.fileName,
        request.headers.range,
      );
    } catch (err: any) {
      server.log.error(err);
      return reply
        .status(500)
        .send({ error: "Stream failed", detail: err.message });
    }
  });

  /**
   * GET /legacy-stream/:messageId
   * Called by the Worker for old files (no accessHash metadata).
   * Streams directly from Telegram by messageId with Range support.
   */
  server.get("/legacy-stream/:messageId", async (request, reply) => {
    const { messageId } = request.params as { messageId: string };
    const msgId = parseInt(messageId, 10);
    if (isNaN(msgId))
      return reply.status(400).send({ error: "Invalid messageId" });

    const r2Key = `legacy_${msgId}`;
    const inR2 = await existsInR2(r2Key);
    if (inR2) {
      const { stream, contentLength } = await streamFromR2(r2Key);
      reply.header("Content-Type", "application/octet-stream");
      reply.header("Accept-Ranges", "bytes");
      reply.header("Cache-Control", "public, max-age=86400");
      if (contentLength) reply.header("Content-Length", String(contentLength));
      return reply.send(stream);
    }

    try {
      return await streamFile(
        reply,
        msgId,
        "application/octet-stream",
        "file",
        request.headers.range,
      );
    } catch (err: any) {
      server.log.error(err);
      return reply
        .status(500)
        .send({ error: "Stream failed", detail: err.message });
    }
  });
}
