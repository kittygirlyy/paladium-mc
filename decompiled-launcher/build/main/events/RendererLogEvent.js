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
const electron_log_1 = __importDefault(require("electron-log"));
const log = electron_log_1.default.create('renderer');
log.transports.file.fileName = 'renderer.log';
electron_1.ipcMain.handle('logError', (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    log.error(...args);
}));
electron_1.ipcMain.handle('logWarn', (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    log.warn(...args);
}));
electron_1.ipcMain.handle('logInfo', (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    log.info(...args);
}));
electron_1.ipcMain.handle('logVerbose', (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    log.verbose(...args);
}));
electron_1.ipcMain.handle('logDebug', (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    log.debug(...args);
}));
electron_1.ipcMain.handle('logSilly', (event, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    log.silly(...args);
}));
