import fs from "fs";
import path from "path";
import os from "os";
import readline from "readline";
import * as navigation from "./commands/navigation.js";
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
          this.showCurrentDir();
          break;
        case "cd":
          this.currentDir = await navigation.cd(this.currentDir, args[0]);
          this.showCurrentDir();
          break;
        case "ls":
          await navigation.ls(this.currentDir);
          break;
        default:
          console.log("Invalid input");
      }
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
