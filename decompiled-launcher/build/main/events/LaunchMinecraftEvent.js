"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const MainWindow_1 = __importDefault(require("../windows/MainWindow"));
const axios_1 = __importDefault(require("axios"));
const electron_log_1 = __importDefault(require("electron-log"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const minecraft_launcher_core_1 = require("minecraft-launcher-core");
const BundledJava_1 = require("../services/BundledJava");
const VanillaBundledJava_1 = require("../services/VanillaBundledJava");
const DownloadService_1 = __importStar(require("../services/DownloadService"));
const StartService_1 = __importDefault(require("../services/StartService"));
const electron_store_1 = __importDefault(require("electron-store"));
const AuthService_1 = require("../services/AuthService");
const store = new electron_store_1.default();
const root = path_1.default.join(electron_1.app.getPath('appData'), '.minecraft');
const checkVersion = (customName, distribVersion, gamePath) => __awaiter(void 0, void 0, void 0, function* () {
    const version = store.get(customName + '_gameVersion', null);
    electron_log_1.default.info(`version game ${customName} : ${version}, distribVersion: ${distribVersion}`);
    if (fs_1.default.existsSync(gamePath) && version !== distribVersion) {
        fs_1.default.rmdirSync(gamePath, { recursive: true });
    }
});
electron_1.ipcMain.handle('getAllVanillaVersions', () => __awaiter(void 0, void 0, void 0, function* () {
    const versionManifest = yield axios_1.default.get('https://launchermeta.mojang.com/mc/game/version_manifest.json');
    const allVersions = [];
    versionManifest.data.versions.forEach(item => {
        if (item.type === 'release') {
            allVersions.push(item.id);
        }
    });
    return allVersions;
}));
electron_1.ipcMain.handle('checkIfVanillaInstalled', (event, mcVersion) => {
    electron_log_1.default.info('checkIfVanillaInstalled');
    return fs_1.default.existsSync(path_1.default.join(root, 'versions', mcVersion, `${mcVersion}.jar`));
});
electron_1.ipcMain.handle('checkIfCustomInstalled', (event, id) => {
    electron_log_1.default.info('checkIfCustomInstalled', id);
    return fs_1.default.existsSync(path_1.default.join(electron_1.app.getPath('appData'), '.' + id));
});
electron_1.ipcMain.handle('launchCustom', (event, distributionUrl, javaVer, customName, tweakClass, classPaths) => __awaiter(void 0, void 0, void 0, function* () {
    electron_log_1.default.info('launchCustom', customName);
    const distributionData = (yield axios_1.default.get(distributionUrl)).data;
    const rootPath = path_1.default.join(electron_1.app.getPath('appData'), '.' + customName);
    MainWindow_1.default.sendWindowWebContent('gameStartup', { id: customName, value: true });
    // Check & download if needed
    BundledJava_1.eventEmitter.on('progress', args => {
        const value = (args.done / args.total) * 100;
        MainWindow_1.default.sendWindowWebContent('gameDownloadProgress', { id: customName, value });
    });
    yield (0, BundledJava_1.DownloadJRE)(javaVer, customName);
    DownloadService_1.eventEmitter.on('progress', args => {
        const value = (args.done / args.total) * 100;
        MainWindow_1.default.sendWindowWebContent('gameDownloadProgress', { id: customName, value });
    });
    DownloadService_1.eventEmitter.on('finish', args => {
        MainWindow_1.default.sendWindowWebContent('gameDownloadFinish', { id: customName });
    });
    yield checkVersion(customName, distributionData.version, rootPath);
    yield (0, DownloadService_1.default)(distributionData, rootPath);
    store.set(customName + '_gameVersion', distributionData.version);
    // Start the game
    const fullscreen = store.get(customName + '_gameStartInFullscreen', false);
    const windowWidth = store.get(customName + '_gameResolutionW', 856);
    const windowHeight = store.get(customName + '_gameResolutionH', 482);
    const memMin = store.get(customName + '_gameMemMin', 2);
    const memMax = store.get(customName + '_gameMemMax', 4);
    const javaPath = store.get(customName + '_gameJavaPath', (0, BundledJava_1.BundledJavaPath)(javaVer));
    // Refresh token
    yield (0, AuthService_1.refreshCurrentAccessToken)();
    yield (0, StartService_1.default)(distributionData, rootPath, {
        tweakClass,
        classPaths,
        authorization: {
            user_properties: '{}',
            access_token: global.share.auth.access_token,
            uuid: global.share.auth.uuid,
            name: global.share.auth.name,
            meta: {
                type: 'msa',
                xuid: global.share.auth.xuid,
                demo: false,
            },
        },
        window: {
            width: windowWidth,
            height: windowHeight,
            fullscreen,
        },
        memory: {
            max: memMax + 'G',
            min: memMin + 'G',
        },
        javaPath,
    });
    setTimeout(() => {
        MainWindow_1.default.sendWindowWebContent('gameStartup', { id: customName, value: false });
    }, 10000);
    // Check if we close the launcher
    const launcherStayOpen = store.get(customName + '_launcherStayOpen', true);
    if (!launcherStayOpen) {
        electron_1.app.quit();
    }
}));
electron_1.ipcMain.handle('launchMinecraftVanilla', (event, mcVersion) => __awaiter(void 0, void 0, void 0, function* () {
    electron_log_1.default.info('launchMinecraftVanilla');
    MainWindow_1.default.sendWindowWebContent('gameStartup', { id: 'minecraft', value: true });
    const fullscreen = store.get('minecraft_gameStartInFullscreen', false);
    const windowWidth = store.get('minecraft_gameResolutionW', 856);
    const windowHeight = store.get('minecraft_gameResolutionH', 482);
    const memMin = store.get('minecraft_gameMemMin', 1);
    const memMax = store.get('minecraft_gameMemMax', 2);
    // Check if it is a legacy version of MC
    let javaVer = BundledJava_1.JavaVersion.Runtime;
    if (parseInt(mcVersion.split('.')[1]) <= 16)
        javaVer = BundledJava_1.JavaVersion.Legacy;
    // Check Java
    const javaPath = store.get('minecraft_gameJavaPath', (0, VanillaBundledJava_1.VanillaBundledJavaPath)(javaVer));
    VanillaBundledJava_1.eventEmitter.on('progress', args => {
        const value = (args.done / args.total) * 100;
        MainWindow_1.default.sendWindowWebContent('gameDownloadProgress', { id: 'minecraft', value });
    });
    yield (0, VanillaBundledJava_1.DownloadVanillaJRE)(javaVer, 'minecraft');
    // Refresh token
    yield (0, AuthService_1.refreshCurrentAccessToken)();
    const launcher = new minecraft_launcher_core_1.Client();
    const opts = {
        root,
        authorization: {
            user_properties: '{}',
            access_token: global.share.auth.access_token,
            uuid: global.share.auth.uuid,
            name: global.share.auth.name,
            meta: {
                type: 'msa',
                xuid: global.share.auth.xuid,
                demo: false,
            },
        },
        version: {
            number: mcVersion,
            type: 'release',
        },
        window: {
            width: windowWidth,
            height: windowHeight,
            fullscreen,
        },
        memory: {
            max: memMax + 'G',
            min: memMin + 'G',
        },
        javaPath,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    launcher.launch(opts);
    // Emitted when launch arguments are set for the Minecraft Jar.
    launcher.on('arguments', () => {
        MainWindow_1.default.sendWindowWebContent('gameDownloadFinish', { id: 'minecraft' });
    });
    launcher.on('progress', data => {
        const value = (data.task / data.total) * 100;
        electron_log_1.default.info('Download Progress:', value, data.type);
        MainWindow_1.default.sendWindowWebContent('gameDownloadProgress', { id: 'minecraft', value });
    });
    launcher.on('finish', args => {
        MainWindow_1.default.sendWindowWebContent('gameDownloadFinish', { id: 'minecraft' });
    });
    launcher.on('close', e => {
        if (e === 1) {
            // Error: Command failed: "java" -version
            electron_1.dialog.showMessageBox({
                type: 'error',
                title: 'Impossible de démarrer Minecraft',
                message: '"Java" n\'est pas reconnu en tant que commande interne ou externe. Vérifier dans les paramètres que le chemin vers Java est valide.',
            });
            setTimeout(() => {
                MainWindow_1.default.sendWindowWebContent('gameStartup', { id: 'minecraft', value: false });
            }, 10000);
        }
    });
    launcher.on('debug', e => electron_log_1.default.debug(e));
    launcher.on('data', e => console.log(e));
    setTimeout(() => {
        MainWindow_1.default.sendWindowWebContent('gameStartup', { id: 'minecraft', value: false });
    }, 10000);
    // Check if we close the launcher
    const launcherStayOpen = store.get('minecraft_launcherStayOpen', true);
    if (!launcherStayOpen) {
        electron_1.app.quit();
    }
}));
