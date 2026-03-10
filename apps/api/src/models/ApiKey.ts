import mongoose from "mongoose";
import crypto from "crypto";

const apiKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  keyPrefix: { type: String, required: true },
  lastUsed: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  revokedAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
});

export function generateApiKey(): { key: string; prefix: string } {
  const raw = crypto.randomBytes(32).toString("hex");
  const key = `id_live_${raw}`;
  const prefix = `id_live_${raw.slice(0, 6)}...`;
  return { key, prefix };
}

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);
