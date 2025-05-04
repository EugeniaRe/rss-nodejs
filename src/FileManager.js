import os from "os";
import readline from "readline";
import * as navigation from "./commands/navigation.js";
import * as files from "./commands/files.js";
import { getOsInfo } from "./commands/osInfo.js";
import { calculateHash } from "./commands/hash.js";
import { compressFile } from "./commands/compress.js";
import { decompressFile } from "./commands/decompress.js";

export class FileManager {
  constructor(username) {
    this.username = username;
    this.currentDir = os.homedir();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.setupSignalHandlers();
  }

  setupSignalHandlers() {
    process.on("SIGINT", () => {
      this.exit();
    });

    this.rl.on("close", () => {
      this.exit();
    });
  }

  start() {
    console.log(`Welcome to the File Manager, ${this.username}!`);
    console.log(`You are currently in ${this.currentDir}`);
    this.prompt();
  }

  showCurrentDir() {
    console.log(`You are currently in ${this.currentDir}`);
  }

  prompt() {
    this.rl.question("> ", async (input) => {
      try {
        await this.processCommand(input.trim());
      } catch (error) {
        console.error("Operation failed");
      } finally {
        this.prompt();
      }
    });
  }

  async processCommand(input) {
    if (input === ".exit") {
      this.exit();
      return;
    }

    const [command, ...args] = input.split(/\s+/);

    try {
      switch (command) {
        case "up":
          this.currentDir = await navigation.up(this.currentDir);
          break;
        case "cd":
          this.currentDir = await navigation.cd(this.currentDir, args[0]);
          break;
        case "ls":
          await navigation.ls(this.currentDir);
          break;
        case "cat":
          await files.readFile(this.currentDir, args[0]);
          break;
        case "add":
          await files.addFile(this.currentDir, args[0]);
          break;
        case "mkdir":
          await files.addDirectory(this.currentDir, args[0]);
          break;
        case "rn":
          await files.renameFile(this.currentDir, args[0], args[1]);
          break;
        case "cp":
          await files.copyFile(this.currentDir, args[0], args[1]);
          break;
        case "mv":
          await files.moveFile(this.currentDir, args[0], args[1]);
          break;
        case "rm":
          await files.deleteFile(this.currentDir, args[0]);
          break;
        case "os":
          await getOsInfo(args[0]);
          break;
        case "hash":
          await calculateHash(this.currentDir, args[0]);
          break;
        case "compress":
          await compressFile(this.currentDir, args[0], args[1]);
          break;
        case "decompress":
          await decompressFile(this.currentDir, args[0], args[1]);
          break;
        default:
          console.log("Invalid input");
      }
      this.showCurrentDir();
    } catch (error) {
      console.log("Operation failed");
    }
  }
  exit() {
    if (this.alreadyExiting) return;
    this.alreadyExiting = true;

    console.log(`Thank you for using File Manager, ${this.username}, goodbye!`);

    if (this.rl) {
      this.rl.close();
    }
    process.exit(0);
  }
}
