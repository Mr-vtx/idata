import { getClient, releaseClient } from "./auth.js";
import { PassThrough } from "stream";

export async function downloadFile(
  messageId: number,
  onProgress?: (downloaded: number, total: number) => void,
): Promise<Buffer> {
  const client = await getClient();
  const channelId = process.env.TELEGRAM_CHANNEL_ID!;

  try {
    const messages = await client.getMessages(channelId, { ids: [messageId] });
    if (!messages || messages.length === 0)
      throw new Error("Message not found");

    const buffer = (await client.downloadMedia(messages[0]!, {
      workers: 16,
      progressCallback: (dl: number, total: number) => {
        onProgress?.(Number(dl), Number(total));
      },
    } as any)) as Buffer;

    return buffer;
  } finally {
    releaseClient(client);
  }
}

export interface StreamResult {
  stream: PassThrough;
  size: number;
}

/**
 * Stream a file from Telegram using parallel chunk workers.
 *
 * Uses iterDownload with 512KB chunks and 16 workers for maximum throughput.
 * Pipe into a PassThrough stream so the caller can pipe to HTTP response.
 *
 * Range support: pass byteStart/byteEnd to stream a specific byte range.
 * This is critical for video seeking — players send Range: bytes=X-Y headers.
 */
export async function downloadFileStream(
  messageId: number,
  onProgress?: (downloaded: number, total: number) => void,
  byteStart?: number,
  byteEnd?: number,
): Promise<StreamResult> {
  const client = await getClient();
  const channelId = process.env.TELEGRAM_CHANNEL_ID!;

  const messages = await client.getMessages(channelId, { ids: [messageId] });
  if (!messages || messages.length === 0) {
    releaseClient(client);
    throw new Error("Message not found");
  }

  const msg = messages[0]! as any;
  const media = msg.media;
  const size: number =
    media?.document?.size || media?.photo?.sizes?.slice(-1)[0]?.size || 0;

  const CHUNK_SIZE = 512 * 1024;
  const start = byteStart ?? 0;
  const alignedOffset = Math.floor(start / CHUNK_SIZE) * CHUNK_SIZE;

  const passThrough = new PassThrough();

  (async () => {
    let downloaded = 0;
    let skipped = 0; 
    try {
      for await (const chunk of client.iterDownload({
        file: media,
        offset: BigInt(alignedOffset),
        requestSize: CHUNK_SIZE,
        limit:
          byteEnd !== undefined
            ? Math.ceil((byteEnd - alignedOffset) / CHUNK_SIZE) * CHUNK_SIZE
            : undefined,
        workers: 16
      } as any)) {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);

        if (skipped < start - alignedOffset) {
          const skip = Math.min(start - alignedOffset - skipped, buf.length);
          skipped += skip;
          const slice = buf.slice(skip);
          if (slice.length > 0) {
            downloaded += slice.length;
            onProgress?.(downloaded, size);
            passThrough.write(slice);
          }
        } else {
          downloaded += buf.length;
          onProgress?.(downloaded, size);
          passThrough.write(buf);
        }

        if (byteEnd !== undefined && alignedOffset + downloaded >= byteEnd)
          break;
      }
      passThrough.end();
    } catch (err) {
      passThrough.destroy(err as Error);
    } finally {
      releaseClient(client);
    }
  })();

  return { stream: passThrough, size };
}
