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

