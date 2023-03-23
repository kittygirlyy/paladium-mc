<h2 align="center"> ━━━━━━  INTRODUCTION  ━━━━━━ </h2>
<div align="center">
   <p></p>
   <a href="https://discord.gg/miaou">
      <img alt="Discord server" src="https://discord.com/api/guilds/1058067015891431514/embed.png?style=banner4">
   </a>
   <br>
</div>
<p/>
<h2></h2>

[OfficialWebsite](https://paladium-pvp.fr)

Paladium is the first French PVP faction server. We offer an exclusive adventure on Minecraft!

What we need to have:
- Node JS
- A brain

Somes books for the next steps to help our super brain :)
- [JVM](https://github.com/n3k0girl/paladium-mc/blob/main/books/JVM.pdf)

## Launcher /I/

I wanted to check something on the launcher when I noticed that it was an electron app...

I'm extracting the **app.asar** (Location: C:\Users\pwnme\AppData\Local\Programs\paladium-group\resources) with that:

- `npm install -g asar`
- `npx asar extract app.asar nekodium`

How is electron app bundled: [Documentation](https://www.electronjs.org/fr/docs/latest/development/build-instructions-windows)

every decompiled files is available in my repo: [LINK](https://github.com/n3k0girl/paladium-mc/tree/main/decompiled-launcher)

### Palanarchy ? 
<img src="https://raw.githubusercontent.com/n3k0girl/paladium-mc/main/decompiled-launcher/renderer/palanarchy/logo.webp">

I noticed somes weird stuffs about palanarchy in the decompiled electron app:

https://download.paladium-pvp.fr/games/palanarchy.json

```json

{
    "name" : "Palanarchy",
    "available" : false,
    "maintenance" : false,
    "compatibility": [],
    "distributions" : []
}

```

Maybe a new mode ? :p

<img src="https://cdn.discordapp.com/attachments/944040587168976897/1012048114359742474/unknown.png">

### GhostAPI ?

```javascript
const content_api_1 = __importDefault(require("@tryghost/content-api"));
const ghostApi = new content_api_1.default({
    url: 'https://ghost.paladium-pvp.fr',
    key: 'cc25825386fcf87df32f7fc535',
    version: 'v3'
});
electron_1.ipcMain.handle('getBlogPosts', () => __awaiter(void 0, void 0, void 0, function* () {
    return null;
}));
```
Yay a new subdomain...

Somes documentations about @GhostAPI
- https://www.npmjs.com/package/@tryghost/content-api
- https://ghost.org/docs/content-api/javascript/

How we are gettings notifications on our launcher ?
<img src="https://cdn.discordapp.com/attachments/944040587168976897/1012051159235694633/unknown.png">

Soluce:
https://download.paladium-pvp.fr/notification.json

### Logs ?

We got somes logs in this location: C:\Users\pwnme\AppData\Roaming\paladium-group\logs\

It can help you for more analysing

## Website Paths /II/

- https://ghost.paladium-pvp.fr
- https://download.paladium-pvp.fr
- https://download.paladium-pvp.fr/distribution.json

```json
{
    "isUnderMaintenance" : false,
    "java": {
        "legacy": {
            "win32":"https://download.paladium-pvp.fr/java/legacy_win.zip",
            "darwin":"https://download.paladium-pvp.fr/java/legacy_mac.zip",
            "linux":"https://download.paladium-pvp.fr/java/legacy_linux.zip"
        },
        "runtime": {
            "linux":"https://download.paladium-pvp.fr/java/runtime_linux.zip",
            "darwin":"https://download.paladium-pvp.fr/java/runtime_mac.zip",
            "win32":"https://download.paladium-pvp.fr/java/runtime_win.zip"
        }
    },
    "distrubutions" : ["https://download.paladium-pvp.fr/games/paladium.json", "https://download.paladium-pvp.fr/games/modded.json", "https://download.paladium-pvp.fr/games/palanarchy.json"]
}
```

LINUX :O 

## Java client /III/

_Disclaimer: I'm dropping the whole source code soon don't worry if you dont understand every steps_

**This topic will be a bit more complex**

I'm assuming you understand how jvm is working and you know a little about java ;-;

So let's start :))

My 1st step was to understand how it downloaded by this shitty launcher look at this code:

```javascript

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

```

and started by this:

```javascript
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
```
