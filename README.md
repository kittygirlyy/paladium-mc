<h2 align="center"> ━━━━━━  INTRODUCTION  ━━━━━━ </h2>
<div align="center">
   <p></p>
   <a href="https://discord.gg/miaou">
      <img alt="Discord server" src="https://discord.com/api/guilds/952168009395486760/embed.png?style=banner4">
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
