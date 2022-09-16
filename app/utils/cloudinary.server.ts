import type { UploadHandler } from "@remix-run/node/formData";
import cloudinary from "cloudinary";
import { randomUUID } from "crypto";
import { join } from "path";
import fs from "fs";

if (process.env.NODE_ENV === "production") {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadFromBuffer = (
  buffer: Buffer,
  options: cloudinary.UploadApiOptions
): Promise<cloudinary.UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
};

async function uploadImageToLocalDisk(buffer: Buffer) {
  const fileName = randomUUID();
  const filePath = join(process.cwd(), "public", "images", fileName);
  fs.writeFileSync(filePath, buffer);
  return fileName;
}

export const uploadHandler: UploadHandler = async ({ name, stream }) => {
  if (name !== "cover") {
    stream.resume();
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    return uploadImageToLocalDisk(await stream.read());
  }

  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    stream.resume();
    return;
  }

  const buffer = Buffer.concat(chunks);

  try {
    const result = await uploadFromBuffer(buffer, {});
    return result?.secure_url || "";
  } catch {
    return "";
  }
};
