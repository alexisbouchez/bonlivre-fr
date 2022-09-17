import cloudinary from "cloudinary";
import { randomUUID } from "crypto";
import { join } from "path";
import fs from "fs";
import type { UploadHandler } from "@remix-run/node";
import {
  writeAsyncIterableToWritable,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
} from "@remix-run/node";

if (process.env.NODE_ENV === "production") {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImageToCloudinary(data: AsyncIterable<Uint8Array>) {
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {},
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    await writeAsyncIterableToWritable(data, uploadStream);
  });

  return uploadPromise;
}

async function uploadImageToLocalDisk(data: AsyncIterable<Uint8Array>) {
  try {
    const uuid = randomUUID();
    const path = join(process.cwd(), "public", "images", uuid);
    const uploadStream = fs.createWriteStream(path);
    await writeAsyncIterableToWritable(data, uploadStream);
    return `/images/${uuid}`;
  } catch {
    return null;
  }
}

export const uploadHandler: UploadHandler = composeUploadHandlers(
  async ({ name, data }) => {
    if (name !== "cover") {
      return undefined;
    }

    if (process.env.NODE_ENV !== "production") {
      return uploadImageToLocalDisk(data);
    }

    try {
      const uploadedImage = (await uploadImageToCloudinary(data)) as {
        secure_url: string;
      };
      return uploadedImage.secure_url;
    } catch {
      return null;
    }
  },
  createMemoryUploadHandler()
);

export const uploadAvatarHandler: UploadHandler = composeUploadHandlers(
  async ({ name, data }) => {
    if (name !== "avatar") {
      return undefined;
    }

    if (process.env.NODE_ENV !== "production") {
      return uploadImageToLocalDisk(data);
    }

    try {
      const uploadedImage = (await uploadImageToCloudinary(data)) as {
        secure_url: string;
      };
      return uploadedImage.secure_url;
    } catch {
      return null;
    }
  },
  createMemoryUploadHandler()
);
