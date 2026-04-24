import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(__dirname, "../../uploads");

export const removeUploadedFile = async (filename) => {
  if (!filename) {
    return;
  }

  const filePath = path.join(uploadDirectory, filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};
