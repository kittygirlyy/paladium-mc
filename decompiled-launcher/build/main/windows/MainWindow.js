"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const electron_store_1 = __importDefault(require("electron-store"));
const store = new electron_store_1.default();
let mainWindow = null;
function getWindow() {
    return mainWindow;
}
function sendWindowWebContentString(channel, args) {
    if (mainWindow) {
        return mainWindow.webContents.send(channel, args);
    }
    else {
        return null;
    }
}
function sendWindowWebContentAny(channel, args) {
    if (mainWindow) {
        return mainWindow.webContents.send(channel, args);
    }
    else {
        return null;
    }
}
function sendWindowWebContent(channel, args) {
    if (mainWindow) {
        return mainWindow.webContents.send(channel, args);
    }
    else {
        return null;
    }
}
function destroyWindow() {
    if (!mainWindow) {
        return;
    }
    electron_log_1.default.info('destroy Main Window');
    mainWindow.close();
    mainWindow = null;
}
function createWindow() {
    destroyWindow();
    electron_log_1.default.info('Create Main Window');
    return new Promise(resolve => {
        mainWindow = new electron_1.BrowserWindow({
            width: 1280,
            height: 720,
            minWidth: 1280,
            minHeight: 720,
            resizable: true,
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
        mainWindow.setMenuBarVisibility(false);
        if (process.env.NODE_ENV === 'development') {
            const rendererPort = process.argv[2];
            mainWindow.loadURL(`http://localhost:${rendererPort}`);
            mainWindow.webContents.openDevTools();
        }
        else {
            mainWindow.loadFile(path_1.default.join(electron_1.app.getAppPath(), 'renderer', 'index.html'));
        }
        mainWindow.once('ready-to-show', () => {
            if (mainWindow) {
                if (store.get('launcherMaximizedAtStartup') === true) {
                    mainWindow.maximize();
                }
                if (electron_1.app.commandLine.getSwitchValue('paladium') === 'true') {
                    sendWindowWebContentAny('goTo', '/paladium');
                }
                else if (electron_1.app.commandLine.getSwitchValue('modded') === 'true') {
                    sendWindowWebContentAny('goTo', '/modded');
                }
                else if (electron_1.app.commandLine.getSwitchValue('palanarchy') === 'true') {
                    sendWindowWebContentAny('goTo', '/palanarchy');
                }
                mainWindow.show();
            }
            resolve();
        });
    });
}
exports.default = {
    getWindow,
    sendWindowWebContentString,
    sendWindowWebContentAny,
    sendWindowWebContent,
    createWindow,
    destroyWindow,
};
