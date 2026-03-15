import type { FastifyInstance } from "fastify";
import { uploadFile, hashFile } from "@repo/core";
import { File } from "../models/File.js";
import { User } from "../models/User.js";
import { createWriteStream, unlinkSync, statSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { pipeline } from "stream/promises";
import { validateApiKey } from "../middleware/apiKeyAuth.js";
import jwt from "jsonwebtoken";

const CDN_URL =
  process.env.CDN_URL || "https://idata-cdn.idata-vans-cdn.workers.dev";

function signDownloadToken(payload: {
  fileId:        string;
  messageId:     number;
  accessHash:    string | null;
  fileReference: string | null;
  dcId:          number | null;
}): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in environment");
  return jwt.sign(payload, secret, { expiresIn: "5m" });
}
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

    const user = await User.findById(userId);
    if (!user) return reply.status(401).send({ error: "User not found" });

    const data = await request.file();
    if (!data) return reply.status(400).send({ error: "No file provided" });

    const tmpPath = join(tmpdir(), `idata_${Date.now()}_${data.filename}`);
    await pipeline(data.file, createWriteStream(tmpPath));
    const fileSize = statSync(tmpPath).size;

    if (user.usedStorage + fileSize > user.storageLimit) {
      try {
        unlinkSync(tmpPath);
      } catch {}
      return reply.status(413).send({
        error: "Storage quota exceeded",
        used: user.usedStorage,
        limit: user.storageLimit,
        remaining: user.storageLimit - user.usedStorage,
      });
    }

    try {
      const sha256 = await hashFile(tmpPath);
      const existing = await File.findOne({ sha256, userId });

      if (existing) {
        const token = signDownloadToken({
          fileId: existing._id.toString(),
          messageId: existing.messageId,
          accessHash: existing.accessHash ?? null,
          fileReference: existing.fileReference ?? null,
          dcId: existing.dcId ?? null,
        });

        return reply.send({
          success: true,
          deduplicated: true,
          fileId: existing._id.toString(),
          fileName: existing.fileName,
          fileSize: existing.fileSize,
          mimeType: existing.mimeType,
          url: `${CDN_URL}/dl/${token}`,
        });
      }

      const result = await uploadFile(
        tmpPath,
        data.filename,
        data.mimetype,
        fileSize,
      );

      const file = await File.create({
        userId,
        fileName: result.fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
        messageId: result.messageId,
        accessHash: result.accessHash,
        fileReference: result.fileReference,
        dcId: result.dcId,
        sha256: result.sha256,
      });

      await User.findByIdAndUpdate(userId, { $inc: { usedStorage: fileSize } });

      const token = signDownloadToken({
        fileId: file._id.toString(),
        messageId: result.messageId,
        accessHash: result.accessHash,
        fileReference: result.fileReference,
        dcId: result.dcId,
      });

      return reply.send({
        success: true,
        deduplicated: false,
        fileId: file._id.toString(),
        fileName: file.fileName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        url: `${CDN_URL}/dl/${token}`,
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
      return reply.send({
        files: files.map((f) => ({
          _id: f._id.toString(),
          fileName: f.fileName,
          fileSize: f.fileSize,
          mimeType: f.mimeType,
          createdAt: f.createdAt,
        })),
      });
    },
  );

  server.get(
    "/files/:id/url",
    { onRequest: [(server as any).authenticate] },
    async (request, reply) => {
      const user = request.user as { id: string };
      const { id } = request.params as { id: string };

      const file = await File.findOne({ _id: id, userId: user.id });
      if (!file) return reply.status(404).send({ error: "File not found" });

      const token = signDownloadToken({
        fileId: file._id.toString(),
        messageId: file.messageId,
        accessHash: file.accessHash ?? null,
        fileReference: file.fileReference ?? null,
        dcId: file.dcId ?? null,
      });

      return reply.send({ url: `${CDN_URL}/dl/${token}` });
    },
  );

  server.delete(
    "/files/:id",
    { onRequest: [(server as any).authenticate] },
    async (request, reply) => {
      const user = request.user as { id: string };
      const { id } = request.params as { id: string };

      const deleted = await File.findOneAndDelete({ _id: id, userId: user.id });
      if (!deleted) return reply.status(404).send({ error: "File not found" });

      await User.findByIdAndUpdate(user.id, {
        $inc: { usedStorage: -deleted.fileSize },
      });

      return reply.send({ success: true });
    },
  );
}
