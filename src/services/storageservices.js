import { supabase } from "./supabase";

export const uploadStorageImage = async ({ file, bucket, folder, prefix = "IMAGE" }) => {
  if (!file) return null;

  const extension = file.name.split(".").pop()?.toLowerCase();
  const fileName = `${prefix}_${Date.now()}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  // console.log("upload image: ", data.publicUrl);
  return data.publicUrl;
};

export const deleteStorageImage = async (imageUrl, bucket) => {
  const path = getStoragePath(imageUrl, bucket);

  if (!path) return null;

  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw error;
  }
  // console.log("delete image: ", data);
  return data;
};

const getStoragePath = (imageUrl, bucket) => {
  if (!imageUrl) return null;

  try {
    const bucketPath = `/storage/v1/object/public/${bucket}/`;
    const decodedUrl = decodeURIComponent(imageUrl);
    const index = decodedUrl.indexOf(bucketPath);

    if (index === -1) return null;

    const data = decodedUrl.substring(index + bucketPath.length);
    // console.log("get image path: ", data);
    return data;
  } catch (error) {
    console.error("Error getting storage path:", error);
    return null;
  }
};