import { ApiKey } from "../models/ApiKey.js";

export async function validateApiKey(key: string): Promise<string | null> {
  const apiKey = await ApiKey.findOne({ key, isActive: true });
  if (!apiKey) return null;

  await ApiKey.findByIdAndUpdate(apiKey._id, { lastUsed: new Date() });

  return apiKey.userId.toString();
}
