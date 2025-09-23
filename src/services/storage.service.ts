import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "../config/environment";

export const r2 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: config.awsAccessKeyId!,
    secretAccessKey: config.awsSecretAccessKey!,
  },
});

export async function uploadCharacterImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: config.r2BucketName!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read",
  });

  await r2.send(command);

  return `${process.env.R2_ENDPOINT}/${fileName}`;
}