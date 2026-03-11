import { getClient } from "./auth.js";
import { PassThrough } from "stream";

export async function downloadFile(
  messageId: number,
  onProgress?: (downloaded: number, total: number) => void,
): Promise<Buffer> {
  const client = await getClient();
  const channelId = process.env.TELEGRAM_CHANNEL_ID!;
  const messages = await client.getMessages(channelId, { ids: [messageId] });
  if (!messages || messages.length === 0) {
    throw new Error("Message not found");
  }
  const buffer = (await client.downloadMedia(messages[0]!, {
    workers: 16,
    progressCallback: (dl: number, total: number) => {
      onProgress?.(Number(dl), Number(total));
    },
  } as any)) as Buffer;
  return buffer;
}

export async function downloadFileStream(
  messageId: number,
  onProgress?: (downloaded: number, total: number) => void,
): Promise<{ stream: PassThrough; size: number }> {
  const client = await getClient();
  const channelId = process.env.TELEGRAM_CHANNEL_ID!;

  const messages = await client.getMessages(channelId, { ids: [messageId] });
  if (!messages || messages.length === 0) {
    throw new Error("Message not found");
  }

  const msg = messages[0]! as any;
  const media = msg.media;
  const size: number =
    media?.document?.size || media?.photo?.sizes?.slice(-1)[0]?.size || 0;

  const passThrough = new PassThrough();

  (async () => {
    try {
      let downloaded = 0;
      for await (const chunk of client.iterDownload({
        file: media,
        requestSize: 512 * 1024, 
        workers: 4,
      } as any)) {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        downloaded += buf.length;
        onProgress?.(downloaded, size);
        passThrough.write(buf);
      }
      passThrough.end();
    } catch (err) {
      passThrough.destroy(err as Error);
    }
  })();

  return { stream: passThrough, size };
}
