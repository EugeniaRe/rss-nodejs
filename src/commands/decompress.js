import { createReadStream, createWriteStream } from "fs";
import { createBrotliDecompress } from "zlib";
import { pipeline } from "stream/promises";
import path from "path";

export async function decompressFile(currentDir, sourcePath, destinationDir) {
  if (!sourcePath || !destinationPath) {
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
    const fileName = path.basename(absoluteSourcePath, ".br");
    const destinationPath = path.join(absoluteDestinationDir, fileName);
    const readStream = createReadStream(absoluteSourcePath);
    const writeStream = createWriteStream(destinationPath);
    const decompressStream = createBrotliDecompress();

    await pipeline(readStream, decompressStream, writeStream);

    console.log(`File decompressed successfully`);
  } catch (error) {
    console.log("Operation failed");
  }
}
