import { api } from "./api";

export async function uploadImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/"))
    throw new Error("Please select an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB.");
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/upload/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data?.success)
    throw new Error(res.data?.message ?? "Upload failed.");
  return res.data.data.url as string;
}
