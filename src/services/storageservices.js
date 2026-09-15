import { supabase } from "./supabase";

export const uploadStorageImage = async ({ file, bucket, folder, prefix = "IMAGE" }) => {
  if (!file) {
    throw new Error("File Name is Required.");
  }
  if (!bucket) {
    throw new Error("Bucket Name is Required.");
  }

  if (!folder) {
    throw new Error("Folder Name is Required.");
  }
  if (!prefix) {
    throw new Error("Prefix is Required.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const fileName = `${prefix}_${Date.now()}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export const deleteStorageImage = async (imageUrl, bucket) => {
  if (!imageUrl) {
    throw new Error("Image URL is Required.");
  }
  if (!bucket) {
    throw new Error("Storage Bucket Name is Required.");
  }

  const path = getStoragePath(imageUrl, bucket);

  if (!path) {
    throw new Error("Path is Required.");
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw error;
  }
  return {
    success: true,
    data
  }
};

const getStoragePath = (imageUrl, bucket) => {
  if (!imageUrl) return null;

  try {
    const bucketPath = `/storage/v1/object/public/${bucket}/`;
    const decodedUrl = decodeURIComponent(imageUrl);
    const index = decodedUrl.indexOf(bucketPath);

    if (index === -1) return null;

    const data = decodedUrl.substring(index + bucketPath.length);

    return data;
  } catch (error) {
    console.error("Error getting storage path:", error);
    return null;
  }
};