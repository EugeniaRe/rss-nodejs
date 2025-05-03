import fs from "fs";
import { createBrotliCompress } from "zlib";
import path from "path";
import { pipeline } from "stream/promises";

export const compressFile = async (currentDir, sourcePath, destinationPath) => {
  if (!sourcePath || !destinationPath) {
    console.log("Invalid input");
    return;
  }
  const absoluteSourcePath = path.isAbsolute(sourcePath)
    ? sourcePath
    : path.join(currentDir, sourcePath);
  const absoluteDestinationPath = path.isAbsolute(destinationPath)
    ? destinationPath
    : path.join(currentDir, destinationPath);

  try {
    const fileName = path.basename(absoluteSourcePath) + ".gz";
    const destinationFile = path.join(absoluteDestinationPath, fileName);
    const readStream = fs.createReadStream(absoluteSourcePath);
    const writeStream = fs.createWriteStream(destinationFile);
    const compressStream = createBrotliCompress();

    await pipeline(readStream, compressStream, writeStream);
    console.log(`File compressed successfully`);
  } catch {
    console.log("Operation failed");
  }
};
