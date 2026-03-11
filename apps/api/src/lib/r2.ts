import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

export async function existsInR2(key: string): Promise<boolean> {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// returns a readable stream instead of buffer
export async function streamFromR2(
  key: string,
): Promise<{ stream: Readable; contentLength?: number }> {
  const res = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  return {
    stream: res.Body as Readable,
    contentLength: res.ContentLength,
  };
}

export async function uploadToR2(
  key: string,
  buffer: Buffer,
  mimeType: string,
): Promise<void> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );
}

// stream upload to R2 — for large files
export async function uploadStreamToR2(
  key: string,
  stream: Readable,
  mimeType: string,
  size?: number,
): Promise<void> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: stream,
      ContentType: mimeType,
      ...(size && { ContentLength: size }),
    }),
  );
}

export async function getFromR2(key: string): Promise<Buffer> {
  const res = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const chunks: Uint8Array[] = [];
  for await (const chunk of res.Body as any) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export async function deleteFromR2(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
 