import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const r2 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function uploadTest() {
  const filePath = path.join(
    process.cwd(),
    "public/images/characters/luke.jpg"
  );
  const fileBuffer = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: "characters/luke.jpg",
    Body: fileBuffer,
    ContentType: "image/jpeg",
    ACL: "public-read", // necessário para acesso público
  });

  await r2.send(command);
  console.log("✅ File uploaded! URL:");
  console.log(`${process.env.R2_ENDPOINT}/characters/luke.jpg`);
}

uploadTest();
