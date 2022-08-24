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
const electron_log_1 = __importDefault(require("electron-log"));
const path = require('path');
const child = require('child_process');
const os = require('os');
function startMinecraft(rootPath, options, launchArguments) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            electron_log_1.default.debug('Launch Arguments:', launchArguments.join(' '));
            let minecraft = child.spawn(options.javaPath, launchArguments, {
                cwd: rootPath,
                detached: true
            });
            minecraft.stdout.on('data', (data) => console.log(data.toString('utf-8')));
            minecraft.stderr.on('data', (data) => console.log(data.toString('utf-8')));
            resolve('success');
            // minecraft.on('close', (code) => this.emit('close', code))
        });
    });
}
function getLaunchOptions(rootPath, options, config) {
    let args = config.arguments.game;
    const fields = {
        '${auth_access_token}': options.authorization.access_token,
        '${auth_session}': options.authorization.access_token,
        '${auth_player_name}': options.authorization.name,
        '${auth_uuid}': options.authorization.uuid,
        '${auth_xuid}': options.authorization.meta.xuid || options.authorization.access_token,
        '${user_properties}': options.authorization.user_properties,
        '${user_type}': options.authorization.meta.type,
        '${version_name}': config.assetIndex.id,
        '${assets_index_name}': config.assetIndex.id,
        '${game_directory}': rootPath,
        '${assets_root}': path.join(rootPath, 'assets'),
        '${game_assets}': path.join(rootPath, 'assets'),
        '${version_type}': config.type,
        '${clientid}': options.authorization.meta.clientId || (options.authorization.client_token || options.authorization.access_token)
    };
    for (let index = 0; index < args.length; index++) {
        if (typeof args[index] === 'object')
            args.splice(index, 2);
        {
            if (Object.keys(fields).includes(args[index])) {
                args[index] = fields[args[index]].replace(/\\/g, '/');
            }
        }
    }
    if (options.window) {
        options.window.fullscreen
            ? args.push('--fullscreen')
            : args.push('--width', options.window.width, '--height', options.window.height);
    }
    return args;
}
function startService(distributionConfig, rootPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const args = [];
            // JVM
            let jvm = distributionConfig.arguments.jvm;
            jvm[jvm.indexOf("-Djava.library.path=${options.library.path}")] = `-Djava.library.path=${path.join(rootPath, 'natives', distributionConfig.assetIndex.id)}`;
            jvm[jvm.indexOf("-Xmx${options.memory.max}")] = `-Xmx${options.memory.max}`;
            jvm[jvm.indexOf("-Xms${options.memory.min}")] = `-Xms${options.memory.min}`;
            switch (os.platform()) {
                case 'win32':
                    jvm.push('-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump');
                    break;
                case 'darwin':
                    break;
                case 'linux':
                    jvm.push('-Xss1M');
                    break;
            }
            // Class
            const classPaths = ['-cp'];
            const classes = () => {
                let classeArray = Array();
                distributionConfig.libraries.map(library => {
                    let item = null;
                    if (library.downloads.classifiers) {
                        switch (os.platform()) {
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
                    classeArray.push(path.join(rootPath, 'libraries', item.path));
                });
                // Jar vanilla
                classeArray.push(path.join(rootPath, 'versions', distributionConfig.assetIndex.id, distributionConfig.assetIndex.id + '.jar'));
                distributionConfig.externalLibraries.map(library => {
                    classeArray.push(path.join(rootPath, 'externalLibraries', library.downloads.artifact.path));
                });
                // @ts-ignore
                return classeArray;
            };
            const separator = os.platform() === 'win32' ? ';' : ':';
            classPaths.push(`${classes().join(separator)}`);
            if (options.classPaths) {
                classPaths.push(options.classPaths);
            }
            if (options.tweakClass) {
                classPaths.push('--tweakClass');
                classPaths.push(options.tweakClass);
            }
            // Launch Options
            const launchOptions = getLaunchOptions(rootPath, options, distributionConfig);
            // @ts-ignore
            const launchArguments = args.concat(jvm, classPaths, launchOptions);
            yield startMinecraft(rootPath, options, launchArguments);
            return resolve('success startMinecraft');
        }));
    });
}
exports.default = startService;
