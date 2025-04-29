import fs from "fs";
import { writeFile, mkdir, rename, stat, unlink } from "fs/promises";
import path from "path";
import { pipeline } from "stream/promises";

export const readFile = async (currentDir, pathToFile) => {
  if (!pathToFile) {
    console.log("Invalid input");
    return;
  }

  const absolutePath = path.isAbsolute(pathToFile)
    ? pathToFile
    : path.join(currentDir, pathToFile);

  try {
    const readStream = fs.createReadStream(absolutePath, "utf8");
    readStream.on("data", (chunk) => process.stdout.write(chunk));
    readStream.on("error", () => {
      console.log("Invalid input");
    });
  } catch {
    console.log("Operation failed");
  }
};

export const addFile = async (currentDir, fileName) => {
  if (!fileName) {
    console.log("Invalid input");
    return;
  }
  const filePath = path.join(currentDir, fileName);

  try {
    await writeFile(filePath, "");
    console.log(`The file ${fileName} was successfully created`);
  } catch {
    throw new Error("Operation failed");
  }
};

export const addDirectory = async (currentDir, dirName) => {
  if (!dirName) {
    console.log("Invalid input");
    return;
  }
  const dirPath = path.join(currentDir, dirName);

  try {
    await mkdir(dirPath);
    console.log(`The directory ${dirName} was successfully created`);
  } catch {
    console.log("Operation failed");
  }
};

export const renameFile = async (currentDir, pathToFile, fileName) => {
  if (!pathToFile || !fileName) {
    console.log("Invalid input");
    return;
  }
  const absolutePath = path.isAbsolute(pathToFile)
    ? pathToFile
    : path.join(currentDir, pathToFile);
  const newPath = path.join(path.dirname(absolutePath), fileName);

  try {
    await rename(absolutePath, newPath);
    console.log(`The file was successfully renamed`);
  } catch {
    console.log("Operation failed");
  }
};

const copy = async (currentDir, sourcePath, destinationPath) => {
  const absoluteSourcePath = path.isAbsolute(sourcePath)
    ? sourcePath
    : path.join(currentDir, sourcePath);

  const absoluteDestination = path.isAbsolute(destinationPath)
    ? destinationPath
    : path.join(currentDir, destinationPath);

  const stats = await stat(absoluteDestination);
  if (!stats.isDirectory()) {
    throw new Error("Invalid input");
  }
  const fileName = path.basename(absoluteSourcePath);
  const destinationFile = path.join(absoluteDestination, fileName);
  const readStream = fs.createReadStream(absoluteSourcePath);
  const writeStream = fs.createWriteStream(destinationFile);

  await pipeline(readStream, writeStream);
};
export const copyFile = async (currentDir, sourcePath, destinationPath) => {
  if (!sourcePath || !destinationPath) {
    console.log("Invalid input");
    return;
  }
  try {
    await copy(currentDir, sourcePath, destinationPath);
    console.log(`File copied successfully to ${destinationPath}`);
  } catch {
    console.log("Operation failed");
  }
};

export const moveFile = async (currentDir, sourcePath, destinationPath) => {
  if (!sourcePath || !destinationPath) {
    console.log("Invalid input");
    return;
  }

  try {
    await copy(currentDir, sourcePath, destinationPath);

    const absoluteSourcePath = path.isAbsolute(sourcePath)
      ? sourcePath
      : path.join(currentDir, sourcePath);

    await unlink(absoluteSourcePath);
    console.log(`File moved successfully to ${destinationPath}`);
  } catch {
    console.log("Operation failed");
  }
};

export const deleteFile = async (currentDir, filePath) => {
  if (!filePath) {
    console.log("Invalid input");
    return;
  }
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(currentDir, filePath);

  try {
    await unlink(absolutePath);
    console.log(`File ${filePath} removed successfully`);
  } catch {
    console.log("Operation failed");
  }
};
