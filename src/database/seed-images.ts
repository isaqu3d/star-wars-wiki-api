import { eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";
import { uploadCharacterImage } from "../services/r2";
import { db } from "./client";
import { characters } from "./schema";

async function seedCharacterImages() {
  const folderPath = path.join(process.cwd(), "public/images/characters");
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const nameWithoutExt = path.parse(file).name;
    const buffer = fs.readFileSync(path.join(folderPath, file));
    const contentType = "image/jpeg";

    const imageUrl = await uploadCharacterImage(
      buffer,
      `characters/${file}`,
      contentType
    );

    const result = await db
      .update(characters)
      .set({ image_url: imageUrl })
      .where(
        eq(
          characters.name,
          nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1)
        )
      );

    console.log(`✅ Updated image for ${nameWithoutExt}: ${imageUrl}`);
  }

  console.log("✅ All character images updated!");
}

seedCharacterImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
