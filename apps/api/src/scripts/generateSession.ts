import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import * as readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text: string): Promise<string> =>
  new Promise((resolve) => rl.question(text, resolve));

async function main() {
  const API_ID = Number(process.env.TELEGRAM_API_ID!);
  const API_HASH = process.env.TELEGRAM_API_HASH!;

  const client = new TelegramClient(new StringSession(""), API_ID, API_HASH, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await question("Phone number (+234...): "),
    phoneCode: async () => await question("Code from Telegram: "),
    password: async () => await question("2FA password (if any): "),
    onError: console.error,
  });

  const session = client.session.save() as unknown as string;

  console.log("\n✅ YOUR SESSION STRING:");
  console.log(session);
  console.log("\nCopy this into your .env as TELEGRAM_SESSION=...\n");

  rl.close();
  await client.disconnect();
  process.exit(0);
}

main().catch(console.error);
