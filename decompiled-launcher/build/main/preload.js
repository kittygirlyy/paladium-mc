"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    // Titlebar
    getLauncherMaximizedAtStartup: () => electron_1.ipcRenderer.invoke('getLauncherMaximizedAtStartup'),
    setLauncherMaximizedAtStartup: val => electron_1.ipcRenderer.send('setLauncherMaximizedAtStartup', val),
    minimizeWindow: () => electron_1.ipcRenderer.send('minimizeWindow'),
    maximizeWindow: () => electron_1.ipcRenderer.send('maximizeWindow'),
    unmaximizeWindow: () => electron_1.ipcRenderer.send('unmaximizeWindow'),
    closeWindow: () => electron_1.ipcRenderer.send('closeWindow'),
    // Auto Update
    checkForUpdates: () => electron_1.ipcRenderer.send('checkForUpdates'),
    quitAndInstallUpdate: () => electron_1.ipcRenderer.send('quitAndInstallUpdate'),
    // Logs
    logError: (...args) => electron_1.ipcRenderer.invoke('logError', ...args),
    logWarn: (...args) => electron_1.ipcRenderer.invoke('logWarn', ...args),
    logInfo: (...args) => electron_1.ipcRenderer.invoke('logInfo', ...args),
    logVerbose: (...args) => electron_1.ipcRenderer.invoke('logVerbose', ...args),
    logDebug: (...args) => electron_1.ipcRenderer.invoke('logDebug', ...args),
    logSilly: (...args) => electron_1.ipcRenderer.invoke('logSilly', ...args),
    // Auto Launch
    getAutoLaunchIsEnabled: () => electron_1.ipcRenderer.invoke('getAutoLaunchIsEnabled'),
    setAutoLaunch: val => electron_1.ipcRenderer.send('setAutoLaunch', val),
    // Authentication
    getAccounts: () => electron_1.ipcRenderer.invoke('getAccounts'),
    changeAccount: (username) => electron_1.ipcRenderer.send('changeAccount', username),
    deleteAccount: (username) => electron_1.ipcRenderer.send('deleteAccount', username),
    logout: () => electron_1.ipcRenderer.send('logout'),
    getAccessToken: () => electron_1.ipcRenderer.send('getAccessToken'),
    getAllVanillaVersions: () => electron_1.ipcRenderer.invoke('getAllVanillaVersions'),
    checkIfVanillaInstalled: mcVersion => electron_1.ipcRenderer.invoke('checkIfVanillaInstalled', mcVersion),
    checkIfCustomInstalled: id => electron_1.ipcRenderer.invoke('checkIfCustomInstalled', id),
    launchCustom: (distributionUrl, javaVer, customName, tweakClass, classPaths) => electron_1.ipcRenderer.invoke('launchCustom', distributionUrl, javaVer, customName, tweakClass, classPaths),
    launchMinecraftVanilla: mcVersion => electron_1.ipcRenderer.invoke('launchMinecraftVanilla', mcVersion),
    // Game Options
    getLastVanillaVersion: () => electron_1.ipcRenderer.invoke('getLastVanillaVersion'),
    getBlogPosts: () => electron_1.ipcRenderer.invoke('getBlogPosts'),
    getGameJavaPath: (id, jreType) => electron_1.ipcRenderer.invoke('getGameJavaPath', id, jreType),
    getGameMem: id => electron_1.ipcRenderer.invoke('getGameMem', id),
    getGameResolution: id => electron_1.ipcRenderer.invoke('getGameResolution', id),
    getGameStartInFullscreen: id => electron_1.ipcRenderer.invoke('getGameStartInFullscreen', id),
    getLauncherStayOpen: id => electron_1.ipcRenderer.invoke('getLauncherStayOpen', id),
    setLastVanillaVersion: (version) => electron_1.ipcRenderer.send('setLastVanillaVersion', version),
    setGameJavaPath: (id, val) => electron_1.ipcRenderer.send('setGameJavaPath', id, val),
    setGameMem: (id, min, max) => electron_1.ipcRenderer.send('setGameMem', id, min, max),
    setGameResolution: (id, w, h) => electron_1.ipcRenderer.send('setGameResolution', id, w, h),
    setGameStartInFullscreen: (id, val) => electron_1.ipcRenderer.send('setGameStartInFullscreen', id, val),
    setLauncherStayOpen: (id, val) => electron_1.ipcRenderer.send('setLauncherStayOpen', id, val),
    // Notifications
    getNotifications: () => electron_1.ipcRenderer.invoke('getNotifications'),
    setNotificationRead: id => electron_1.ipcRenderer.send('setNotificationRead', id),
    setNotificationArchive: id => electron_1.ipcRenderer.send('setNotificationArchive', id),
    // Others
    getVersion: () => electron_1.ipcRenderer.invoke('getVersion'),
    getTotalMem: () => electron_1.ipcRenderer.invoke('getTotalMem'),
    getFreeMem: () => electron_1.ipcRenderer.invoke('getFreeMem'),
    getIsUnderMaintenance: () => electron_1.ipcRenderer.invoke('getIsUnderMaintenance'),
    isWindows: () => electron_1.ipcRenderer.invoke('isWindows'),
    isMacos: () => electron_1.ipcRenderer.invoke('isMacos'),
    isLinux: () => electron_1.ipcRenderer.invoke('isLinux'),
    loadURL: (url) => electron_1.ipcRenderer.invoke('loadURL', url),
    // Listeners
    onGoTo: fn => {
        electron_1.ipcRenderer.on('goTo', (event, ...args) => fn(...args));
    },
    onUserDataFetch: fn => {
        electron_1.ipcRenderer.on('userDataFetch', (event, ...args) => fn(...args));
    },
    onUpdateAvailable: fn => {
        electron_1.ipcRenderer.on('updateAvailable', (event, ...args) => fn(...args));
    },
    onGameDownloadProgress: fn => {
        electron_1.ipcRenderer.on('gameDownloadProgress', (event, ...args) => fn(...args));
    },
    onGameStartup: fn => {
        electron_1.ipcRenderer.on('gameStartup', (event, ...args) => fn(...args));
    },
    onGameDownloadFinish: fn => {
        electron_1.ipcRenderer.on('gameDownloadFinish', (event, ...args) => fn(...args));
    },
    onNotifications: fn => {
        electron_1.ipcRenderer.on('onNotifications', (event, ...args) => fn(...args));
    },
    onSetLoginBtn: fn => {
        electron_1.ipcRenderer.on('setLoginBtn', (event, ...args) => fn(...args));
    },
    onUpdateAccounts: fn => {
        electron_1.ipcRenderer.on('updateAccounts', (event, ...args) => fn(...args));
    },
});
