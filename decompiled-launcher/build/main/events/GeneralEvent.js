"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const axios_1 = __importDefault(require("axios"));
const os_1 = __importDefault(require("os"));
electron_1.ipcMain.handle('getVersion', () => {
    return electron_1.app.getVersion();
});
electron_1.ipcMain.handle('getTotalMem', () => {
    return os_1.default.totalmem();
});
electron_1.ipcMain.handle('getFreeMem', () => {
    return os_1.default.freemem();
});
electron_1.ipcMain.handle('getIsUnderMaintenance', () => __awaiter(void 0, void 0, void 0, function* () {
    const distribution = (yield axios_1.default.get('https://download.paladium-pvp.fr/distribution.json')).data;
    return distribution.isUnderMaintenance;
}));
electron_1.ipcMain.handle('isWindows', () => {
    return os_1.default.platform() === 'win32';
});
electron_1.ipcMain.handle('isMacos', () => {
    return os_1.default.platform() === 'darwin';
});
electron_1.ipcMain.handle('isLinux', () => {
    return os_1.default.platform() === 'linux';
});
