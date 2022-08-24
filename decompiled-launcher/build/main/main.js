"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const UpdateWindow_1 = __importDefault(require("./windows/UpdateWindow"));
const electron_log_1 = __importDefault(require("electron-log"));
require('electron-debug')({ showDevTools: true });
global.share = {
    auth: {
        access_token: '',
        uuid: '',
        xuid: '',
        name: '',
    },
};
const gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.whenReady().then(() => {
        electron_log_1.default.info('ready');
        UpdateWindow_1.default.createWindow();
        // app.on('activate', function () {
        //   // On macOS it's common to re-create a window in the app when the
        //   // dock icon is clicked and there are no other windows open.
        //   if (BrowserWindow.getAllWindows().length === 0) {
        //     createWindow();
        //   }
        // });
    });
}
// Open external links in the default browser
electron_1.app.on('web-contents-created', function (createEvent, contents) {
    contents.setWindowOpenHandler(({ url }) => {
        electron_1.shell.openExternal(url);
        return { action: 'deny' };
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
require('./events');
