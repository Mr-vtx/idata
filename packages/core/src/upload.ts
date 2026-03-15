import { getClient, releaseClient } from "./auth.js";
import { CustomFile } from "telegram/client/uploads.js";
import { statSync, createReadStream } from "fs";
import { createHash } from "crypto";

export interface UploadResult {
  messageId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  accessHash: string | null;
  fileReference: string | null;
  dcId: number | null;
  sha256: string;
  deduplicated: boolean;
}


export async function hashFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

export async function uploadFile(
  filePath: string,
  fileName: string,
  mimeType: string,
  fileSize?: number,
  onProgress?: (progress: number) => void,
): Promise<UploadResult> {
  const client = await getClient();
  const channelId = process.env.TELEGRAM_CHANNEL_ID!;
  const size = fileSize ?? statSync(filePath).size;
  const sha256 = await hashFile(filePath);
  const customFile = new CustomFile(fileName, size, filePath);

  let result: any;
  try {
    result = await client.sendFile(channelId, {
      file: customFile,
      caption: fileName,
      workers: 16,
      forceDocument: true,
      progressCallback: (progress) => {
        onProgress?.(Math.round(progress * 100));
      },
    });
  } finally {
    releaseClient(client);
  }

  let accessHash: string | null = null;
  let fileReference: string | null = null;
  let dcId: number | null = null;

  try {
    const media = result?.media;
    const doc = media?.document || media?.photo;
    if (doc) {
      accessHash = doc.accessHash?.toString() ?? null;
      fileReference = Buffer.from(doc.fileReference).toString("hex");
      dcId = doc.dcId ?? null;
    }
  } catch {
  }

  return {
    messageId: result.id,
    fileName,
    fileSize: size,
    mimeType,
    accessHash,
    fileReference,
    dcId,
    sha256,
    deduplicated: false,
  };
}
