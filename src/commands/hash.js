import fs from "fs";
import { createHash } from "crypto";
import path from "path";

export const calculateHash = async (currentDir, filePath) => {
  if (!filePath) {
    console.log("Invalid input");
    return;
  }

  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(currentDir, filePath);

  try {
    const hash = createHash("sha256");
    const readStream = fs.createReadStream(absolutePath);

    readStream.on("data", (chunk) => hash.update(chunk));
    readStream.on("end", () => console.log(hash.digest("hex")));
    readStream.on("error", () => {
      console.log("Operation failed");
    });
  } catch {
    console.log("Operation failed");
  }
};
