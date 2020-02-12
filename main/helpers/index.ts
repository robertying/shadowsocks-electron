import { BrowserWindow, Tray, screen } from "electron";

export const getBestWindowPosition = (win: BrowserWindow, tray: Tray) => {
  const winBounds = win.getBounds();
  const trayBounds = tray.getBounds();

  const trayScreen = screen.getDisplayNearestPoint({
    x: trayBounds.x,
    y: trayBounds.y
  });

  const workArea = trayScreen.workArea;
  const screenBounds = trayScreen.bounds;

  if (workArea.x > 0) {
    return {
      x: workArea.x,
      y: workArea.height - winBounds.height
    };
  }

  if (workArea.y > 0) {
    return {
      x: Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2),
      y: workArea.y
    };
  }

  if (workArea.width < screenBounds.width) {
    return {
      x: workArea.width - winBounds.width,
      y: screenBounds.height - winBounds.height
    };
  }

  return {
    x: Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2),
    y: workArea.height - winBounds.height
  };
};
