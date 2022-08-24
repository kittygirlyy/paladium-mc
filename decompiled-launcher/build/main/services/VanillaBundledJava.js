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
exports.eventEmitter = exports.VanillaBundledJavaPath = exports.DownloadVanillaJRE = void 0;
const BundledJava_1 = require("./BundledJava");
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const os_1 = __importDefault(require("os"));
const axios_1 = __importDefault(require("axios"));
const electron_log_1 = __importDefault(require("electron-log"));
const fs_1 = __importDefault(require("fs"));
const download_1 = __importDefault(require("download"));
const { execSync } = require("child_process");
const EventEmitter = require('events').EventEmitter;
let eventEmitter = new EventEmitter();
exports.eventEmitter = eventEmitter;
const Hash_1 = require("../utils/Hash");
function DownloadVanillaJRE(version, customName) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // Get data
        const javaPath = path_1.default.join(electron_1.app.getPath('userData'), 'java', 'vanilla', version);
        const distribution = (yield axios_1.default.get('https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json')).data;
        let manifestUrl = null;
        let javaStr = version === BundledJava_1.JavaVersion.Runtime ? 'java-runtime-beta' : 'jre-legacy';
        let currFiles = 0;
        switch (os_1.default.platform()) {
            case 'win32':
                manifestUrl = distribution['windows-x64'][javaStr][0].manifest.url;
                break;
            case 'darwin':
                manifestUrl = distribution['mac-os'][javaStr][0].manifest.url;
                break;
            case 'linux':
                manifestUrl = distribution['linux'][javaStr][0].manifest.url;
                break;
        }
        if (manifestUrl === null || manifestUrl === undefined) {
            electron_log_1.default.error(`Failed to download vanilla JRE ${version}`);
            return reject();
        }
        let manifestData = (yield axios_1.default.get(manifestUrl)).data;
        const filesObj = Object.entries(manifestData.files);
        const totalFiles = filesObj.length;
        for (const object of filesObj) {
            const [key, value] = object;
            if (!value.downloads || !value.downloads.raw) {
                continue;
            }
            const fullPath = path_1.default.join(javaPath, key);
            let fullFolderPath = path_1.default.parse(fullPath).dir;
            // Check if need update or exist
            let needDownload = false;
            if (!fs_1.default.existsSync(fullPath)) { // If file exist?
                fs_1.default.mkdirSync(fullFolderPath, { recursive: true });
                needDownload = true;
            }
            else { // Check if checksum is the same
                if (!((0, Hash_1.getHexHash)(fullPath) === value.downloads.raw.sha1)) {
                    needDownload = true;
                }
            }
            if (needDownload) {
                // log.info('before', fullFolderPath);
                // fullFolderPath = fullFolderPath.replace('jre.bundle/', '');
                // log.info('after', fullFolderPath);
                // log.info('Download', value.downloads.raw.url, 'at', fullFolderPath);
                // await download(value.downloads.raw.url, fullFolderPath);
                fs_1.default.writeFileSync(fullFolderPath, yield (0, download_1.default)(value.downloads.raw.url), {
                    encoding: "utf8",
                    mode: 0o755
                });
                // if(process.platform == "darwin" && value.executable){
                //     log.info(`Whitelisting from Apple Quarantine ${fullPath}`);
                //     let id = String.fromCharCode.apply(null, execSync(`xattr -p com.apple.quarantine "${fullPath}"`));
                //     execSync(`xattr -w com.apple.quarantine "${id.replace("0081;", "00c1;")}" "${fullPath}"`);
                // }
            }
            currFiles++;
            eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
        }
        if (os_1.default.platform() === 'darwin') {
            try {
                fs_1.default.chmodSync(`${path_1.default.join(javaPath, 'jre.bundle/Contents/Home/bin/java')}`, '755');
            }
            catch (e) {
                electron_log_1.default.error(`Failed to chmod Java due to: ${e}`);
                return reject();
            }
        }
        return resolve();
    }));
}
exports.DownloadVanillaJRE = DownloadVanillaJRE;
function VanillaBundledJavaPath(version) {
    electron_log_1.default.info('VanillaBundledJavaPath', version);
    return path_1.default.join(electron_1.app.getPath('userData'), 'java', 'vanilla', version, os_1.default.platform() === 'win32' ? path_1.default.join('bin', 'java') : 'jre.bundle/Contents/Home/bin/java');
}
exports.VanillaBundledJavaPath = VanillaBundledJavaPath;
