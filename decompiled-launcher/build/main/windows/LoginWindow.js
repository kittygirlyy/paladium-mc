"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
let loginWindow = undefined;
function sendWindowWebContentBool(channel, args) {
    if (loginWindow) {
        return loginWindow.webContents.send(channel, args);
    }
    else {
        return null;
    }
}
function getWindow() {
    return loginWindow;
}
function destroyWindow() {
    if (!loginWindow) {
        return;
    }
    electron_log_1.default.info('destroy Login Window');
    loginWindow.close();
    loginWindow = undefined;
}
function createWindow() {
    destroyWindow();
    electron_log_1.default.info('Create Update Window');
    loginWindow = new electron_1.BrowserWindow({
        width: 616,
        height: 840,
        resizable: false,
        transparent: os_1.default.platform() === 'win32',
        frame: os_1.default.platform() !== 'win32',
        titleBarStyle: os_1.default.platform() === 'win32' ? 'hidden' : 'hiddenInset',
        show: false,
        webPreferences: {
            preload: path_1.default.join(__dirname, '..', 'preload.js'),
        },
    });
    // Hide the default menu
    electron_1.Menu.setApplicationMenu(null);
    loginWindow.setMenuBarVisibility(false);
    if (process.env.NODE_ENV === 'development') {
        const rendererPort = process.argv[2];
        loginWindow.loadURL(`http://localhost:${rendererPort}#login`);
        loginWindow.webContents.openDevTools();
    }
    else {
        loginWindow.loadFile(path_1.default.join(electron_1.app.getAppPath(), 'renderer', 'index.html'), { hash: 'login' });
    }
    loginWindow.once('ready-to-show', () => {
        if (loginWindow) {
            loginWindow.show();
        }
    });
}
exports.default = {
    sendWindowWebContentBool,
    getWindow,
    createWindow,
    destroyWindow,
};
