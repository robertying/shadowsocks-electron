import { app, BrowserWindow, Tray, Menu, shell } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import os from "os";
import { autoUpdater } from "electron-updater";
import { setMainWindow, stopClient } from "./proxy";
import logger from "./logs";
import { setupAfterInstall } from "./install";
import { getBestWindowPosition } from "./helpers";

const platform = os.platform();

autoUpdater.logger = logger;

const width = 400;
const height = 460;

app.setAppUserModelId("io.robertying.shadowsocks-electron");
app.dock?.hide();

let win: BrowserWindow;
let tray: Tray;
let quitting = false;

const showWindow = () => {
  if (platform === "darwin" || platform === "win32") {
    const position = getBestWindowPosition(win, tray);
    win.setPosition(position.x, position.y);
  }
  win.show();
};

const createWindow = () => {
  win = new BrowserWindow({
    width,
    height,
    icon: path.resolve(__dirname, "../assets/logo.png"),
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (platform === "darwin") {
    win.hide();
  }
  win.removeMenu();
  win.setVisibleOnAllWorkspaces(true);
  win.setAlwaysOnTop(true);

  win.on("minimize", (e: Electron.Event) => {
    e.preventDefault();
    win.hide();
  });

  win.on("close", e => {
    if (!quitting) {
      e.preventDefault();
      win.hide();
    }
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.resolve(__dirname, "../build/index.html")}`
  );

  setMainWindow(win);

  win.webContents.on("new-window", (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });
  isDev && win.webContents.openDevTools();
};

const createTray = () => {
  tray = new Tray(
    path.resolve(
      __dirname,
      platform === "darwin"
        ? "../assets/trayTemplate.png"
        : platform === "win32"
        ? "../assets/icon.ico"
        : "../assets/logo.png"
    )
  );

  const menu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        showWindow();
      }
    },
    {
      label: "Hide App",
      click: () => {
        win.hide();
      }
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        quitting = true;
        app.quit();
      }
    }
  ]);

  if (platform !== "linux") {
    tray.on("click", e => {
      if (win.isVisible()) {
        win.hide();
      } else {
        showWindow();
      }
    });
    tray.on("right-click", () => {
      tray.popUpContextMenu(menu);
    });
  } else {
    tray.setContextMenu(menu);
  }
};

app.on("ready", async () => {
  await setupAfterInstall();
  createWindow();
  createTray();

  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  quitting = true;
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
