import os from "os";
export const getOsInfo = async (arg) => {
  if (!arg) {
    console.log("Invalid input");
    return;
  }
  switch (arg) {
    case "--EOL":
      console.log(JSON.stringify(os.EOL));
      break;
    case "--cpus":
      const cpus = os.cpus();
      console.log(`Overall amount of CPUs: ${cpus.length}`);
      console.table(
        cpus.map((cpu) => ({
          Model: cpu.model,
          "Clock rate (GHz)": cpu.speed / 1000,
        }))
      );
      break;
    case "--homedir":
      console.log(os.homedir());
      break;
    case "--username":
      console.log(os.userInfo().username);
      break;
    case "--architecture":
      console.log(os.arch());
      break;
    default:
      console.log("Invalid input");
  }
};
