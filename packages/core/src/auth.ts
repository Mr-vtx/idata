import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

interface PooledClient {
  client: TelegramClient;
  busy: boolean;
  index: number;
}

const pool: PooledClient[] = [];
let poolReady = false;

function getSessionStrings(): string[] {
  const sessions: string[] = [];

  for (let i = 1; i <= 5; i++) {
    const s = process.env[`TELEGRAM_SESSION_${i}`];
    if (s) sessions.push(s);
  }

  if (sessions.length === 0 && process.env.TELEGRAM_SESSION) {
    sessions.push(process.env.TELEGRAM_SESSION);
  }

  return sessions;
}

async function buildPool(): Promise<void> {
  if (poolReady) return;

  const API_ID = process.env.TELEGRAM_API_ID
    ? Number(process.env.TELEGRAM_API_ID)
    : undefined;
  const API_HASH = process.env.TELEGRAM_API_HASH;

  if (!API_ID || !API_HASH) {
    throw new Error("Missing TELEGRAM_API_ID or TELEGRAM_API_HASH in .env");
  }

  const sessions = getSessionStrings();
  if (sessions.length === 0) {
    throw new Error("No Telegram session found. Set TELEGRAM_SESSION in .env");
  }

  for (let i = 0; i < sessions.length; i++) {
    const client = new TelegramClient(
      new StringSession(sessions[i]),
      API_ID,
      API_HASH,
      {
        connectionRetries: 10,
        retryDelay: 1000,
        requestRetries: 10,
        timeout: 300,
        useWSS: false,
      },
    );
    await client.connect();
    pool.push({ client, busy: false, index: i });
  }

  poolReady = true;
}

export async function getClient(): Promise<TelegramClient> {
  await buildPool();

  const idle = pool.find((p) => !p.busy);
  if (idle) {
    idle.busy = true;
    if (!idle.client.connected) await idle.client.connect();
    setTimeout(() => {
      idle.busy = false;
    }, 30_000);
    return idle.client;
  }

  const fallback = pool[0];
  if (!fallback.client.connected) await fallback.client.connect();
  return fallback.client;
}


export function releaseClient(client: TelegramClient): void {
  const entry = pool.find((p) => p.client === client);
  if (entry) entry.busy = false;
}

export async function getSessionString(
  client: TelegramClient,
): Promise<string> {
  return client.session.save() as unknown as string;
}
