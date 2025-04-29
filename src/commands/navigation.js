import { access, stat, readdir } from "fs/promises";
import path from "path";

export const up = async (currentDir) => {
  const parentDir = path.dirname(currentDir);
  if (parentDir === currentDir) return currentDir;

  await access(parentDir);

  return parentDir;
};

export const cd = async (currentDir, dirPath) => {
  if (!dirPath) console.log("Invalid input");
  const targetDir = path.isAbsolute(dirPath)
    ? dirPath
    : path.join(currentDir, dirPath);
  const stats = await stat(targetDir);
  if (!stats.isDirectory()) console.log("Invalid input");

  return path.resolve(targetDir);
};

export const ls = async (currentDir) => {
  const files = await readdir(currentDir);
  const stats = await Promise.all(
    files.map((file) => stat(path.join(currentDir, file)))
  );

  const items = files.map((file, index) => ({
    name: file,
    type: stats[index].isDirectory() ? "directory" : "file",
  }));

  const directories = items
    .filter((item) => item.type === "directory")
    .sort((a, b) => a.name.localeCompare(b.name));

  const filesList = items
    .filter((item) => item.type === "file")
    .sort((a, b) => a.name.localeCompare(b.name));

  console.table([...directories, ...filesList]);
};
