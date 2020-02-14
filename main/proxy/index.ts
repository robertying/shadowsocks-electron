import { ChildProcess, spawn } from "child_process";
import os from "os";
import { BrowserWindow } from "electron";
import { Config, Settings, Mode } from "../types";
import logger from "../logs";
import * as networksetup from "./networksetup";
import * as gsettings from "./gsettings";
import { startPacServer, stopPacServer } from "../server";
import { generateFullPac } from "../pac";
import { setupIfFirstRun, binDir } from "../install";

const platform = os.platform();

let mainWindow: BrowserWindow | null = null;

export const setMainWindow = (window: BrowserWindow) => {
  mainWindow = window;
};

const setProxy = async (
  status: "on" | "off",
  mode?: Mode,
  localPort?: number,
  pacPort?: number
) => {
  if (mode === "Manual") {
    return;
  }

  switch (platform) {
    case "darwin":
      if (status === "off") {
        await networksetup.unsetProxy();
        stopPacServer();
      } else if (mode === "Global") {
        await networksetup.setGlobalProxy("127.0.0.1", localPort ?? 1080);
      } else if (mode === "PAC") {
        await setupIfFirstRun();
        await generateFullPac(localPort ?? 1080);
        startPacServer(pacPort ?? 1090);
        await networksetup.setPacProxy(
          `http://localhost:${pacPort ?? 1090}/proxy.pac`
        );
      }
      break;
    case "linux":
      if (status === "off") {
        await gsettings.unsetProxy();
        stopPacServer();
      } else if (mode === "Global") {
        await gsettings.setGlobalProxy("127.0.0.1", localPort ?? 1080);
      } else if (mode === "PAC") {
        await setupIfFirstRun();
        await generateFullPac(localPort ?? 1080);
        startPacServer(pacPort ?? 1090);
        await gsettings.setPacProxy(
          `http://localhost:${pacPort ?? 1090}/proxy.pac`
        );
      }
      break;
  }
};

let ssLocal: ChildProcess | null = null;
let connected = false;

const spawnClient = async (config: Config, settings: Settings) => {
  const args = [
    "-s",
    config.serverHost,
    "-p",
    config.serverPort.toString(),
    "-l",
    settings.localPort.toString(),
    "-k",
    config.password,
    "-m",
    config.encryptMethod,
    config.udp ? "-u" : "",
    config.fastOpen ? "--fast-open" : "",
    config.noDelay ? "--no-delay" : "",
    config.plugin ? "--plugin" : "",
    config.plugin ?? "",
    config.pluginOpts ? "--plugin-opts" : "",
    config.pluginOpts ?? "",
    settings.verbose ? "-v" : "",
    "-t",
    (config.timeout ?? "60").toString()
  ];

  ssLocal = spawn(
    platform === "win32" ? "./ss-local.exe" : "./ss-local",
    args,
    {
      cwd: binDir
    }
  );

  ssLocal.stdout?.once("data", async () => {
    logger.info("Started ss-local");

    await setProxy("on", settings.mode, settings.localPort, settings.pacPort);
    logger.info("Set proxy on");

    connected = true;
    mainWindow?.webContents.send("connected", true);
  });
  ssLocal.stdout?.on("data", data => {
    logger.info(data);
  });
  ssLocal.on("error", err => {
    logger.error(err);
  });
  ssLocal.on("exit", async (code, signal) => {
    logger.info(`Exited ss-local with code ${code} or signal ${signal}`);

    await setProxy("off");
    logger.info("Set proxy off");

    connected = false;
    mainWindow?.webContents.send("connected", false);

    ssLocal = null;
  });
};

const killClient = async () => {
  ssLocal?.kill("SIGKILL");
  logger.info("Killed ss-local");
};

export const startClient = async (config: Config, settings: Settings) => {
  if (!ssLocal) {
    await spawnClient(config, settings);
  } else {
    await killClient();
    await new Promise(resolve => setTimeout(() => resolve(), 1000));
    await spawnClient(config, settings);
  }
};

export const stopClient = async () => {
  await killClient();
};

export const isConnected = () => {
  return connected;
};
