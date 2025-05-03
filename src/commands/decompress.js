import fs from "fs";
import { createBrotliDecompress } from "zlib";
import path from "path";
import { pipeline } from "stream/promises";

export async function decompressFile(currentDir, sourcePath, destinationDir) {
  if (!sourcePath || !destinationDir) {
    console.log("Invalid input");
    return;
  }
  try {
    const absoluteSourcePath = path.isAbsolute(sourcePath)
      ? sourcePath
      : path.join(currentDir, sourcePath);
    const absoluteDestinationDir = path.isAbsolute(destinationDir)
      ? destinationDir
      : path.join(currentDir, destinationDir);
    const fileName = path.basename(absoluteSourcePath, ".gz");
    const destinationPath = path.join(absoluteDestinationDir, fileName);
    const readStream = fs.createReadStream(absoluteSourcePath);
    const writeStream = fs.createWriteStream(destinationPath);
    const decompressStream = createBrotliDecompress();

    await pipeline(readStream, decompressStream, writeStream);

    console.log(`File decompressed successfully`);
  } catch (error) {
    console.log("Operation failed");
  }
}
