import dotenv from "dotenv";
dotenv.config();
import { getClient } from "../packages/core/src/auth.js";
import mongoose from "mongoose";

const channelId = process.env.TELEGRAM_CHANNEL_ID!;
const MONGODB_URI = process.env.MONGODB_URI!;

async function main() {
  // Connect to MongoDB
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const client = await getClient();

  // Fetch last 100 messages from channel (increase limit as needed)
  const messages = await client.getMessages(channelId, { limit: 100 });

  console.log(`Found ${messages.length} messages in Telegram channel\n`);

  for (const msg of messages) {
    const media = (msg as any).media;
    const doc   = media?.document || media?.photo;
    if (!doc) continue; // skip non-file messages

    const messageId    = msg.id;
    const fileName     = doc.attributes?.find((a: any) => a.fileName)?.fileName || `file_${messageId}`;
    const fileSize     = doc.size || 0;
    const mimeType     = doc.mimeType || "application/octet-stream";
    const accessHash   = doc.accessHash?.toString() ?? null;
    const fileReference = Buffer.from(doc.fileReference).toString("hex");
    const dcId         = doc.dcId ?? null;

    console.log(`msgId=${messageId} | ${fileName} | ${(fileSize/1024/1024).toFixed(2)}MB | ${mimeType}`);
    console.log(`  accessHash=${accessHash?.slice(0,20)}... dcId=${dcId}`);
    console.log();
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(console.error);
