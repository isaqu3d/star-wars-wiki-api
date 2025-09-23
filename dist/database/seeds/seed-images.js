"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const storage_service_1 = require("../../services/storage.service");
const database_1 = require("../../config/database");
const schema_1 = require("../schema");
async function seedCharacterImages() {
    const folderPath = node_path_1.default.join(process.cwd(), "public/images/characters");
    const files = node_fs_1.default.readdirSync(folderPath);
    for (const file of files) {
        const nameWithoutExt = node_path_1.default.parse(file).name; // "luke", "leia", etc.
        const buffer = node_fs_1.default.readFileSync(node_path_1.default.join(folderPath, file));
        const contentType = "image/jpeg"; // ou detecta via mime
        // Faz upload para o R2
        const imageUrl = await (0, storage_service_1.uploadCharacterImage)(buffer, `characters/${file}`, contentType);
        // Atualiza o personagem existente pelo nome
        const result = await database_1.db
            .update(schema_1.characters)
            .set({ image_url: imageUrl })
            .where((0, drizzle_orm_1.eq)(schema_1.characters.name, nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1)));
        console.log(`✅ Updated image for ${nameWithoutExt}: ${imageUrl}`);
    }
    console.log("✅ All character images updated!");
}
seedCharacterImages().catch((err) => {
    console.error(err);
    process.exit(1);
});
