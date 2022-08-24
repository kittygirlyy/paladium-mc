"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_store_1 = __importDefault(require("electron-store"));
const store = new electron_store_1.default();
electron_1.ipcMain.handle('getLauncherMaximizedAtStartup', () => {
    return store.get('launcherMaximizedAtStartup');
});
electron_1.ipcMain.on('setLauncherMaximizedAtStartup', (event, val) => {
    store.set('launcherMaximizedAtStartup', val);
});
electron_1.ipcMain.on('closeWindow', () => {
    const focusedWindow = electron_1.BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
        focusedWindow.close();
    }
    electron_1.app.quit();
});
electron_1.ipcMain.on('minimizeWindow', () => {
    const focusedWindow = electron_1.BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
        focusedWindow.minimize();
    }
});
electron_1.ipcMain.on('maximizeWindow', () => {
    const focusedWindow = electron_1.BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
        focusedWindow.maximize();
    }
});
electron_1.ipcMain.on('unmaximizeWindow', () => {
    const focusedWindow = electron_1.BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
        focusedWindow.unmaximize();
    }
});
