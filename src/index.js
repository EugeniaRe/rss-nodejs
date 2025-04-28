import { FileManager } from "./FileManager.js";
const app = () => {
  const username = process.env.npm_config_username || "User";

  const fileManager = new FileManager(username);
  fileManager.start();

  process.on("SIGINT", () => {
    fileManager.exit();
  });
};

app();
