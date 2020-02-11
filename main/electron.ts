import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import { setMainWindow, stopClient } from "./proxy";
import logger from "./logs";
import { setupAfterInstall } from "./install";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 450,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.removeMenu();

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.resolve(__dirname, "../build/index.html")}`
  );

  setMainWindow(win);

  isDev && win.webContents.openDevTools();
};

app.on("ready", async () => {
  await setupAfterInstall();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", async () => {
  logger.info("App will quit. Cleaning up...");
  await stopClient();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
