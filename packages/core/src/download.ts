import { getClient } from "./auth.js";

export async function downloadFile(
  messageId: number,
  onProgress?: (downloaded: number, total: number) => void,
): Promise<Buffer> {
  const client = await getClient();
  const channelId = process.env.TELEGRAM_CHANNEL_ID!;

  const messages = await client.getMessages(channelId, {
    ids: [messageId],
  });

  if (!messages || messages.length === 0) {
    throw new Error("Message not found");
  }

  const buffer = (await client.downloadMedia(messages[0]!, {
    progressCallback: (dl, total) => {
      onProgress?.(Number(dl), Number(total));
    },
  })) as Buffer;

  return buffer;
}
