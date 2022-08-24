"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const BundledJava_1 = require("../services/BundledJava");
const electron_store_1 = __importDefault(require("electron-store"));
const store = new electron_store_1.default();
// Getters
electron_1.ipcMain.handle('getLastVanillaVersion', (event) => {
    return store.get('vanilla_lastVersion');
});
electron_1.ipcMain.handle('getGameJavaPath', (event, id, jreType) => {
    return store.get(id + '_gameJavaPath', (0, BundledJava_1.BundledJavaPath)(jreType === 'runtime' ? BundledJava_1.JavaVersion.Runtime : BundledJava_1.JavaVersion.Legacy));
});
electron_1.ipcMain.handle('getGameMem', (event, id) => {
    return {
        min: store.get(id + '_gameMemMin', 2),
        max: store.get(id + '_gameMemMax', 4),
    };
});
electron_1.ipcMain.handle('getGameResolution', (event, id) => {
    return {
        w: store.get(id + '_gameResolutionW', 856),
        h: store.get(id + '_gameResolutionH', 482),
    };
});
electron_1.ipcMain.handle('getGameStartInFullscreen', (event, id) => {
    return store.get(id + '_gameStartInFullscreen', false);
});
electron_1.ipcMain.handle('getLauncherStayOpen', (event, id) => {
    return store.get(id + '_launcherStayOpen', true);
});
// Setters
electron_1.ipcMain.on('setLastVanillaVersion', (event, version) => {
    store.set('vanilla_lastVersion', version);
});
electron_1.ipcMain.on('setGameJavaPath', (event, id, val) => {
    if (val.length === 0) {
        val = (0, BundledJava_1.BundledJavaPath)(BundledJava_1.JavaVersion.Runtime); //ToDo : need to replace java version depending MC version
    }
    store.set(id + '_gameJavaPath', val);
});
electron_1.ipcMain.on('setGameMem', (event, id, min, max) => {
    store.set(id + '_gameMemMin', min);
    store.set(id + '_gameMemMax', max);
});
electron_1.ipcMain.on('setGameResolution', (event, id, width, height) => {
    store.set(id + '_gameResolutionW', width);
    store.set(id + '_gameResolutionH', height);
});
electron_1.ipcMain.on('setGameStartInFullscreen', (event, id, val) => {
    store.set(id + '_gameStartInFullscreen', val);
});
electron_1.ipcMain.on('setLauncherStayOpen', (event, id, val) => {
    store.set(id + '_launcherStayOpen', val);
});
