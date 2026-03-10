import { getClient } from "./auth.js";
import { CustomFile } from "telegram/client/uploads.js";
import { statSync } from "fs";

export interface UploadResult {
  messageId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
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
  const customFile = new CustomFile(fileName, size, filePath);

  const result = await client.sendFile(channelId, {
    file: customFile,
    caption: fileName,
    workers: 2,
    forceDocument: true,
    progressCallback: (progress) => {
      onProgress?.(Math.round(progress * 100));
    },
  });

  return {
    messageId: result.id,
    fileName,
    fileSize: size,
    mimeType,
  };
}
