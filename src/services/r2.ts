import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadCharacterImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read",
  });

  await r2.send(command);

  return `${process.env.R2_ENDPOINT}/${fileName}`;
}
