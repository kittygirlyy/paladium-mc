"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const UpdateWindow_1 = __importDefault(require("../windows/UpdateWindow"));
const AuthService_1 = __importDefault(require("../services/AuthService"));
const electron_updater_1 = require("electron-updater");
const electron_log_1 = __importDefault(require("electron-log"));
electron_1.ipcMain.on('checkForUpdates', () => {
    electron_log_1.default.info('checkForUpdates ipcMain');
    if (process.env.NODE_ENV === 'development' && UpdateWindow_1.default.getWindow() !== null) {
        (0, AuthService_1.default)();
    }
    else {
        electron_updater_1.autoUpdater.checkForUpdates();
    }
});
electron_1.ipcMain.on('quitAndInstallUpdate', () => {
    electron_log_1.default.info('quitAndInstallUpdate');
    electron_updater_1.autoUpdater.quitAndInstall();
});
electron_updater_1.autoUpdater.on('update-available', () => {
    electron_log_1.default.info('update-available');
    const updateWindow = UpdateWindow_1.default.getWindow();
    if (updateWindow) {
        updateWindow.webContents.send('updateAvailable');
    }
});
electron_updater_1.autoUpdater.on('update-not-available', () => {
    electron_log_1.default.info('update-not-available');
    (0, AuthService_1.default)();
});
electron_updater_1.autoUpdater.on('update-downloaded', () => {
    electron_log_1.default.info('update-downloaded');
    electron_updater_1.autoUpdater.quitAndInstall();
});
electron_updater_1.autoUpdater.on('error', err => {
    if (process.env.NODE_ENV === 'development' && err.code === 'ENOENT') {
        return;
    }
    electron_log_1.default.info('autoUpdater error ', err);
});
