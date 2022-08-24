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
const auto_launch_1 = __importDefault(require("auto-launch"));
const electron_log_1 = __importDefault(require("electron-log"));
const appAutoLaunch = new auto_launch_1.default({
    name: 'Paladium',
    path: electron_1.app.getPath('exe'),
});
electron_1.ipcMain.handle('getAutoLaunchIsEnabled', () => __awaiter(void 0, void 0, void 0, function* () {
    const isEnabled = yield appAutoLaunch.isEnabled();
    electron_log_1.default.info('getAutoLauncherIsEnabled ' + isEnabled);
    return isEnabled;
}));
electron_1.ipcMain.on('setAutoLaunch', (event, val) => {
    electron_log_1.default.info('setAutoLauncher', val);
    if (val) {
        appAutoLaunch.enable();
    }
    else {
        appAutoLaunch.disable();
    }
});
