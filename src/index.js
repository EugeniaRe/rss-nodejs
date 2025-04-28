const app = () => {
  const username = process.env.npm_config_username || "User";

  console.log(username);

  process.on("SIGINT", () => {
    fileManager.exit();
  });
};

app();
