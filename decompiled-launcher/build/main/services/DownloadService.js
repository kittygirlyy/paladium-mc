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
exports.eventEmitter = void 0;
const axios_1 = __importDefault(require("axios"));
const electron_log_1 = __importDefault(require("electron-log"));
const os_1 = __importDefault(require("os"));
const Hash_1 = require("../utils/Hash");
const fs = require('fs');
const path = require('path');
const download = require('download');
const Zip = require('adm-zip');
const EventEmitter = require('events').EventEmitter;
let eventEmitter = new EventEmitter();
exports.eventEmitter = eventEmitter;
const resourceUrl = 'https://resources.download.minecraft.net/';
const deleteFileNotWhiteListed = (filesList, whitelist, rootPath) => {
    filesList.forEach(element => {
        let whitelisted = false;
        for (let i = 0; i < whitelist.length; i++) {
            const el = path.join(rootPath, path.normalize(whitelist[i]));
            if (el.includes('*')) {
                const r = path.normalize(element).startsWith(el.replaceAll('*', ''));
                if (r) {
                    whitelisted = true;
                    break;
                }
            }
            else {
                if (path.normalize(element) === el) {
                    whitelisted = true;
                    break;
                }
            }
        }
        if (!whitelisted) {
            electron_log_1.default.info('Suppression du fichier :', element);
            fs.unlinkSync(element);
        }
    });
};
function downloadService(distributionConfig, rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const assetObjectsConfig = yield (yield axios_1.default.get(distributionConfig.assetIndex.url)).data;
        const totalFiles = distributionConfig.libraries.length
            + distributionConfig.assets.length
            + distributionConfig.externalLibraries.length
            + Object.entries(assetObjectsConfig.objects).length
            + 1; // +1 for client.jar
        let currFiles = 0;
        const nativeDirectory = path.join(rootPath, 'natives', distributionConfig.assetIndex.id);
        if (!fs.existsSync(nativeDirectory)) { // If folder exist?
            fs.mkdirSync(nativeDirectory, { recursive: true });
        }
        const recur = target => {
            let all = [];
            try {
                fs.readdirSync(target, { withFileTypes: true })
                    .forEach(entry => {
                    if (entry.isDirectory()) {
                        all.push(...recur(target + '/' + entry.name + '/'));
                    }
                    else { // Only files
                        // @ts-ignore
                        all.push(path.join(target, entry.name));
                    }
                });
            }
            catch (e) {
            }
            finally {
                return all;
            }
        };
        // libraries
        let librariesFilesOnDisk = recur(path.join(rootPath, 'libraries')) || [];
        yield Promise.all(distributionConfig.libraries.map((library) => __awaiter(this, void 0, void 0, function* () {
            let item = null;
            if (library.downloads.classifiers) {
                switch (os_1.default.platform()) {
                    case 'win32':
                        if (library.downloads.classifiers['natives-windows'])
                            item = library.downloads.classifiers['natives-windows'];
                        else if (library.downloads.classifiers['natives-windows-64'])
                            item = library.downloads.classifiers['natives-windows-64'];
                        break;
                    case 'darwin':
                        if (library.downloads.classifiers['natives-osx'])
                            item = library.downloads.classifiers['natives-osx'];
                        else
                            return;
                        break;
                    case 'linux':
                        if (library.downloads.classifiers['natives-linux'])
                            item = library.downloads.classifiers['natives-linux'];
                        else
                            return;
                        break;
                }
            }
            else {
                item = library.downloads.artifact;
            }
            if (item === null)
                return;
            const fullPath = path.join(rootPath, 'libraries', item.path);
            const fullFolderPath = path.parse(fullPath).dir;
            // Remove to the current files on disk list
            // @ts-ignore
            let index = librariesFilesOnDisk.indexOf(fullPath);
            if (index !== -1) {
                librariesFilesOnDisk.splice(index, 1);
            }
            if (!fs.existsSync(fullFolderPath)) { // If folder exist?
                fs.mkdirSync(fullFolderPath, { recursive: true });
            }
            else { // Check if checksum is the same
                if (fs.existsSync(fullPath) && (0, Hash_1.getHexHash)(fullPath) === item.sha1) {
                    currFiles++;
                    eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
                    return;
                }
            }
            electron_log_1.default.info('Download', item.url, 'at', fullFolderPath);
            yield download(item.url, fullFolderPath);
            currFiles++;
            eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
            // Need to be extracted?
            if (library.extract) {
                electron_log_1.default.info('Extract', fullPath, 'in', nativeDirectory);
                try {
                    new Zip(fullPath).extractAllTo(nativeDirectory, true);
                }
                catch (e) {
                    electron_log_1.default.warn(e);
                }
            }
        })));
        // Remove unused files
        deleteFileNotWhiteListed(librariesFilesOnDisk, distributionConfig.whitelist, rootPath);
        // external Libraries
        librariesFilesOnDisk = recur(path.join(rootPath, 'externalLibraries'));
        yield Promise.all(distributionConfig.externalLibraries.map((library) => __awaiter(this, void 0, void 0, function* () {
            const item = library.downloads.artifact;
            const fullPath = path.join(rootPath, 'externalLibraries', item.path);
            const fullFolderPath = path.parse(fullPath).dir;
            // Remove to the current files on disk list
            // @ts-ignore
            let index = librariesFilesOnDisk.indexOf(fullPath);
            if (index !== -1) {
                librariesFilesOnDisk.splice(index, 1);
            }
            if (!fs.existsSync(fullFolderPath)) { // If folder exist?
                fs.mkdirSync(fullFolderPath, { recursive: true });
            }
            else { // Check if checksum is the same
                if (fs.existsSync(fullPath) && (0, Hash_1.getHexHashCrc32)(fullPath) === item.hash) {
                    currFiles++;
                    eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
                    return;
                }
            }
            electron_log_1.default.info('Download', item.url, 'at', fullFolderPath);
            yield download(item.url, fullFolderPath);
            currFiles++;
            eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
        })));
        // Remove unused files
        deleteFileNotWhiteListed(librariesFilesOnDisk, distributionConfig.whitelist, rootPath);
        // assets mods, resourcepacks, shaderpacks
        electron_log_1.default.info('Check for mods, resourcepacks, shaderpacks');
        librariesFilesOnDisk = [
            ...recur(path.join(rootPath, 'mods')),
            ...recur(path.join(rootPath, 'resourcepacks')),
            ...recur(path.join(rootPath, 'shaderpacks'))
        ];
        yield Promise.all(distributionConfig.assets.map((asset) => __awaiter(this, void 0, void 0, function* () {
            const fullFolderPath = path.join(rootPath, asset.type);
            const urlParse = path.parse(asset.url);
            const fileName = urlParse.name;
            const fileExtension = urlParse.ext;
            const filePath = path.join(fullFolderPath, fileName + fileExtension);
            // Remove to the current files on disk list
            // @ts-ignore
            let index = librariesFilesOnDisk.indexOf(filePath);
            if (index !== -1) {
                librariesFilesOnDisk.splice(index, 1);
            }
            if (!fs.existsSync(filePath)) { // If file exist?
                fs.mkdirSync(fullFolderPath, { recursive: true });
            }
            else { // Check if checksum is the same
                if (fs.existsSync(filePath) && (0, Hash_1.getHexHashCrc32)(filePath) === asset.hash) {
                    currFiles++;
                    eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
                    return;
                }
            }
            electron_log_1.default.info('Download', asset.url, 'at', fullFolderPath);
            yield download(asset.url, fullFolderPath);
            currFiles++;
            eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
        })));
        // Remove unused files
        deleteFileNotWhiteListed(librariesFilesOnDisk, distributionConfig.whitelist, rootPath);
        // assets
        const assetFullPath = path.join(rootPath, 'assets');
        // Check assetIndexes
        electron_log_1.default.info('Check for assetIndexes...');
        const assetIndexData = distributionConfig.assetIndex;
        const assetIndexesFullPath = path.join(assetFullPath, 'indexes');
        const assetIndexesFilePath = path.join(assetIndexesFullPath, assetIndexData.id + '.json');
        let needDownload = false;
        if (!fs.existsSync(assetIndexesFilePath)) { // If file exist?
            fs.mkdirSync(assetIndexesFullPath, { recursive: true });
            needDownload = true;
        }
        else { // Check if checksum is the same
            if (!((0, Hash_1.getHexHash)(assetIndexesFilePath) === assetIndexData.sha1)) {
                needDownload = true;
            }
        }
        if (needDownload) {
            electron_log_1.default.info('Download', assetIndexData.url, 'at', assetIndexesFullPath);
            yield download(assetIndexData.url, assetIndexesFullPath);
        }
        currFiles++;
        eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
        // Check assetObjects
        electron_log_1.default.info('Check for assetObjects...');
        const assetObjectsFullPath = path.join(assetFullPath, 'objects');
        librariesFilesOnDisk = recur(assetObjectsFullPath);
        for (const object of Object.entries(assetObjectsConfig.objects)) {
            const [key, value] = object;
            const subHash = value.hash.substring(0, 2);
            const subAsset = path.join(assetObjectsFullPath, subHash);
            const subAssetFile = path.join(subAsset, value.hash);
            // Remove to the current files on disk list
            // @ts-ignore
            let index = librariesFilesOnDisk.indexOf(subAssetFile);
            if (index !== -1) {
                librariesFilesOnDisk.splice(index, 1);
            }
            if (!fs.existsSync(subAssetFile)) { // If file exist?
                fs.mkdirSync(subAsset, { recursive: true });
            }
            else {
                currFiles++;
                eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
                continue;
            }
            const downloadUrl = resourceUrl + subHash + '/' + value.hash;
            electron_log_1.default.info('Download', downloadUrl, 'at', subAsset);
            fs.writeFileSync(subAssetFile, yield download(downloadUrl));
            currFiles++;
            eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
        }
        // Remove unused files
        deleteFileNotWhiteListed(librariesFilesOnDisk, distributionConfig.whitelist, rootPath);
        // versions
        electron_log_1.default.info('Check for client version...');
        const versionsFullPath = path.join(rootPath, 'versions', distributionConfig.assetIndex.id);
        const versionsFilePath = path.join(rootPath, 'versions', distributionConfig.assetIndex.id, distributionConfig.assetIndex.id + '.jar');
        needDownload = false;
        if (!fs.existsSync(versionsFullPath)) { // If file exist?
            fs.mkdirSync(versionsFullPath, { recursive: true });
            needDownload = true;
        }
        else {
            if ((0, Hash_1.getHexHashCrc32)(versionsFilePath) !== distributionConfig.clientHash) {
                needDownload = true;
            }
        }
        if (needDownload) {
            electron_log_1.default.info('Download', distributionConfig.client, 'at', versionsFilePath);
            fs.writeFileSync(versionsFilePath, yield download(distributionConfig.client));
        }
        currFiles++;
        eventEmitter.emit('progress', { done: currFiles, total: totalFiles });
        electron_log_1.default.info('Download service done');
        eventEmitter.emit('finish', true);
    });
}
exports.default = downloadService;
