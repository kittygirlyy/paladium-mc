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
exports.eventEmitter = exports.BundledJavaPath = exports.DownloadJRE = exports.JavaVersion = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const axios_1 = __importDefault(require("axios"));
const request_1 = __importDefault(require("request"));
const fs_1 = __importDefault(require("fs"));
const electron_log_1 = __importDefault(require("electron-log"));
const { exec } = require("child_process");
const EventEmitter = require('events').EventEmitter;
let eventEmitter = new EventEmitter();
exports.eventEmitter = eventEmitter;
const Zip = require('adm-zip');
var JavaVersion;
(function (JavaVersion) {
    JavaVersion["Legacy"] = "legacy";
    JavaVersion["Runtime"] = "runtime";
})(JavaVersion = exports.JavaVersion || (exports.JavaVersion = {}));
function GetUrlByOS(distribution) {
    switch (os_1.default.platform()) {
        case 'win32':
            return distribution.win32;
        case 'darwin':
            return distribution.darwin;
        case 'linux':
            return distribution.linux;
    }
}
function DownloadJRE(version, customName) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // Get data
        eventEmitter.emit('progress', { done: 1, total: 6 });
        const distribution = (yield axios_1.default.get('https://download.paladium-pvp.fr/distribution.json')).data;
        eventEmitter.emit('progress', { done: 2, total: 6 });
        let downloadUrl = '';
        let typeStr = '';
        switch (version) {
            case JavaVersion.Legacy:
                typeStr = 'legacy';
                downloadUrl = GetUrlByOS(distribution.java.legacy);
                break;
            case JavaVersion.Runtime:
                typeStr = 'runtime';
                downloadUrl = GetUrlByOS(distribution.java.runtime);
                break;
        }
        // Check if not already installed
        if (fs_1.default.existsSync(path_1.default.join(electron_1.app.getPath('userData'), 'java', typeStr))) {
            electron_log_1.default.info(`JRE ${version} already installed`);
            eventEmitter.emit('progress', { done: 6, total: 6 });
            return resolve(); // Stop here, already installed
        }
        eventEmitter.emit('progress', { done: 3, total: 6 });
        // Download zip
        eventEmitter.emit('progress', { done: 4, total: 6 });
        let baseRequest = request_1.default.defaults({
            pool: { maxSockets: 2 },
            timeout: 10000
        });
        const _request = baseRequest(downloadUrl);
        const destFolder = path_1.default.join(electron_1.app.getPath('userData'), 'java');
        if (!fs_1.default.existsSync(destFolder))
            fs_1.default.mkdirSync(destFolder);
        eventEmitter.emit('progress', { done: 5, total: 6 });
        const zipPath = path_1.default.join(destFolder, typeStr + '.zip');
        const file = fs_1.default.createWriteStream(zipPath, {
            encoding: "utf8",
            mode: 0o755
        });
        electron_log_1.default.info('Download JRE', version, file.path);
        _request.pipe(file);
        file.on('error', (e) => __awaiter(this, void 0, void 0, function* () {
            electron_log_1.default.error(`Failed to download asset ${downloadUrl} due to: ${e}`);
            return reject();
        }));
        _request.on('response', (data) => {
            if (data.statusCode === 404) {
                electron_log_1.default.error(`Failed to download ${downloadUrl} due to: File not found...`);
                return reject();
            }
        });
        file.once('finish', () => {
            // Unzip
            try {
                new Zip(file.path).extractAllTo(path_1.default.join(electron_1.app.getPath('userData'), 'java', typeStr), true);
                if (fs_1.default.existsSync(zipPath))
                    fs_1.default.unlinkSync(zipPath);
            }
            catch (e) {
                electron_log_1.default.error(`Failed to unzip ${file.path} due to: ${e}`);
                return reject();
            }
            if (os_1.default.platform() === 'darwin') {
                try {
                    //chmod +x ~/Library/Application\ Support/paladium-group/java/legacy/java/jre.bundle/Contents/Home/bin/java
                    fs_1.default.chmodSync(`${path_1.default.join(electron_1.app.getPath('userData'), 'java', typeStr, 'java/bin/jre.bundle/Contents/Home/bin/java')}`, '755');
                }
                catch (e) {
                    electron_log_1.default.error(`Failed to chmod ${file.path} due to: ${e}`);
                    return reject();
                }
            }
            eventEmitter.emit('progress', { done: 6, total: 6 });
            return resolve();
        });
    }));
}
exports.DownloadJRE = DownloadJRE;
function BundledJavaPath(version) {
    return path_1.default.join(electron_1.app.getPath('userData'), 'java', version, 'java', 'bin', os_1.default.platform() === 'win32' ? 'java' : 'jre.bundle/Contents/Home/bin/java');
}
exports.BundledJavaPath = BundledJavaPath;
