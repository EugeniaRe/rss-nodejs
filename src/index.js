import { FileManager } from "./FileManager.js";
const app = () => {
  const args = process.argv.slice(2);
  const usernameArg = args.find((arg) => arg.startsWith("--username="));
  const username = usernameArg ? usernameArg.split("=")[1] : "User";

  const fileManager = new FileManager(username);
  fileManager.start();

  process.on("SIGINT", () => {
    fileManager.exit();
  });
};

app();
