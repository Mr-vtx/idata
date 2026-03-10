import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

const API_ID = process.env.TELEGRAM_API_ID
  ? Number(process.env.TELEGRAM_API_ID)
  : undefined;

const API_HASH = process.env.TELEGRAM_API_HASH;

if (!API_ID || !API_HASH) {
  throw new Error("Missing TELEGRAM_API_ID or TELEGRAM_API_HASH in .env");
}

let client: TelegramClient | null = null;

export async function getClient(): Promise<TelegramClient> {
  if (client) {
    if (!client.connected) await client.connect();
    return client;
  }

  const session = new StringSession(process.env.TELEGRAM_SESSION || "");
  client = new TelegramClient(session, API_ID as number, API_HASH as string, {
    connectionRetries: 10,
    retryDelay: 1000,
    requestRetries: 10,
    timeout: 300,
    useWSS: false,
  });

  await client.connect();
  return client;
}

export async function getSessionString(
  client: TelegramClient,
): Promise<string> {
  return client.session.save() as unknown as string;
}
