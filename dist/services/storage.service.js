"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.r2 = void 0;
exports.uploadCharacterImage = uploadCharacterImage;
const client_s3_1 = require("@aws-sdk/client-s3");
const environment_1 = require("../config/environment");
exports.r2 = new client_s3_1.S3Client({
    endpoint: process.env.R2_ENDPOINT,
    region: "us-east-1",
    credentials: {
        accessKeyId: environment_1.config.awsAccessKeyId,
        secretAccessKey: environment_1.config.awsSecretAccessKey,
    },
});
async function uploadCharacterImage(fileBuffer, fileName, contentType) {
    const command = new client_s3_1.PutObjectCommand({
        Bucket: environment_1.config.r2BucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: "public-read",
    });
    await exports.r2.send(command);
    return `${process.env.R2_ENDPOINT}/${fileName}`;
}
