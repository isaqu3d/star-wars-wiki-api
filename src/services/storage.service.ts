import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "../config/environment";

export const r2 = new S3Client({
  ...(config.r2.endpoint && { endpoint: config.r2.endpoint }),
  region: config.r2.region,
  credentials: {
    accessKeyId: config.r2.accessKeyId!,
    secretAccessKey: config.r2.secretAccessKey!,
  },
});

export async function uploadCharacterImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
) {
  // Validate file type for security
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(contentType)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (fileBuffer.length > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  // Sanitize filename
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');

  const command = new PutObjectCommand({
    Bucket: config.r2.bucketName!,
    Key: sanitizedFileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read",
    Metadata: {
      uploadedAt: new Date().toISOString(),
    },
  });

  await r2.send(command);

  return `${config.r2.endpoint}/${sanitizedFileName}`;
}