import fs from "fs-extra";
import path from "path";
import { app } from "electron";
import isDev from "electron-is-dev";
import logger from "../logs";
import { generatePacWithoutPort } from "../pac";

export const appDir = isDev
  ? path.resolve(__dirname, "../../")
  : path.resolve(__dirname, "../../../../");
export const appDataDir = app.getPath("userData");

export const binDir = path.resolve(appDataDir, "bin");
export const pacDir = path.resolve(appDataDir, "pac");

export const setupAfterInstall = async () => {
  try {
    const newInstall = !(
      (await fs.pathExists(binDir)) && (await fs.pathExists(pacDir))
    );

    if (!newInstall) {
      return;
    }

    logger.info("New install detected");
    logger.info("Copying bin & pac to APPDATA...");

    await fs.copy(path.resolve(appDir, "bin"), binDir);
    await fs.copy(path.resolve(appDir, "pac"), pacDir);

    logger.info("Copied bin & pac");
  } catch (err) {
    logger.error(err);
  }
};

export const setupIfFirstRun = async () => {
  try {
    const firstRun = !(await fs.pathExists(path.resolve(pacDir, "pac.txt")));

    if (!firstRun) {
      return;
    }

    logger.info("First run detected");

    const data = await fs.readFile(path.resolve(pacDir, "gfwlist.txt"));
    const text = data.toString("ascii");
    await generatePacWithoutPort(text);
  } catch (err) {
    logger.error(err);
  }
};
