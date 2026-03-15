import dotenv from "dotenv";
dotenv.config();
import { getClient } from "../packages/core/src/auth.js";
import mongoose from "mongoose";

// ← paste your user ID here
const MY_USER_ID = "69b632d979d9b55877e8092f";
const channelId = process.env.TELEGRAM_CHANNEL_ID!;

// inline File model to avoid import issues
const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileName: String,
  fileSize: Number,
  mimeType: String,
  messageId: Number,
  accessHash: String,
  fileReference: String,
  dcId: Number,
  sha256: String,
  isMultiPart: { type: Boolean, default: false },
  parts: [],
  createdAt: { type: Date, default: Date.now },
});
const File = mongoose.models.File || mongoose.model("File", fileSchema);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB\n");

  const client = await getClient();
  const messages = await client.getMessages(channelId, { limit: 100 });

  let imported = 0;
  let skipped = 0;

  for (const msg of messages) {
    const media = (msg as any).media;
    const doc = media?.document || media?.photo;
    if (!doc) continue;

    const messageId = msg.id;

    // Skip if already in DB
    const exists = await File.findOne({ messageId });
    if (exists) {
      console.log(`SKIP  msgId=${messageId} — already in DB`);
      skipped++;
      continue;
    }

    const fileName =
      doc.attributes?.find((a: any) => a.fileName)?.fileName ||
      `file_${messageId}`;
    const fileSize = Number(doc.size || 0);
    const mimeType = doc.mimeType || "application/octet-stream";
    const accessHash = doc.accessHash?.toString() ?? null;
    const fileReference = Buffer.from(doc.fileReference).toString("hex");
    const dcId = doc.dcId ?? null;

    await File.create({
      userId: new mongoose.Types.ObjectId(MY_USER_ID),
      fileName,
      fileSize,
      mimeType,
      messageId,
      accessHash,
      fileReference,
      dcId,
    });

    console.log(
      `SAVED msgId=${messageId} | ${fileName} | ${(fileSize / 1024 / 1024).toFixed(2)}MB`,
    );
    imported++;
  }

  console.log(`\nDone — imported: ${imported}, skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(console.error);
