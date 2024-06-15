# Lavalink Client
Easy, flexible and feature-rich lavalink@v4 Client. Both for Beginners and Proficients.

<div align="center">
  <p> 
    <img src="https://madewithlove.now.sh/at?heart=true&template=for-the-badge" alt="Made with love in Austria">
    <img alt="Made with TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
  </p>
  <p>
    <a href="https://www.npmjs.com/package/lavalink-client">
      <img src="https://img.shields.io/npm/v/lavalink-client.svg?maxAge=3600&style=for-the-badge&logo=npm&logoColor=red" alt="NPM version" />
    </a>
    <a href="https://www.npmjs.com/package/lavalink-client">
      <img src="https://img.shields.io/npm/dt/lavalink-client.svg?maxAge=3600&style=for-the-badge&logo=npm&logoColor=red" alt="NPM downloads" />
    </a>
    <a href="https://lc4.gitbook.io/lavalink-client/">
      <img src="https://img.shields.io/badge/Documation-%230288D1.svg?style=for-the-badge&logo=gitbook&logoColor=white" alt="Get Started Now">
    </a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/lavalink-client"><img src="https://nodei.co/npm/lavalink-client.png?downloads=true&stars=true" alt="npm install lavalink-client" /></a>
  </p>
</div>

# Install

Latest stable Version: **`v2.1.3`**

<details><summary>👉 via NPM</summary>

```bash
npm install --save lavalink-client
```


Dev Version: (Current)

```bash
npm install tomato6966/lavalink-client
```

</details>

<details><summary>👉 via YARN</summary>

```bash
yarn add lavalink-client
```

Dev Version: (Current)

```bash
yarn add tomato6966/lavalink-client
```

</details>

# Documentation

Check out the [Documentation](https://lc4.gitbook.io/lavalink-client) | or the [TSDocumentation](https://tomato6966.github.io/lavalink-client/) for **Examples**, and **__detailled__ Docs**, and to figure out **how to get started**. *note: it's not fully done yet (see the docs)*

# Used in:

- [Betty](https://betty.cx/)
- [Mivator](https://discord.gg/5dUb7M2qCj)

# Features

- 💯 Lavalink v4 Supported only (with Lavalink Plugins)

- ✅ Player-Destroy Reasons like:
  - Channel got deleted, Player got disconnected...

- ✨ Choose able queue stores (maps, collections, redis, databases, ...)
  - You can create your own queueStore, thus make it easy to sync queues accross multiple connections (e.g. dashboard-bot)
  - Automated Queue Sync methods 
  - Automated unresolveable Tracks (save the queries as Partial Track Objects -> Fetch the tracks only once they are gonna play)

- 😍 Included Filter & Equalizer Management

- 👍 Multiple Player Options *for easier use*
  - onDisconnect -> Player Destroy / auto Reconnect
  - onEmptyQueue -> Player Destroy / leave After x Time
  - instaFixFilter -> seek the player after applying a filter, to instantly apply it's effect (only works for little-durational-songs)
  - applyVolumeAsFilter -> instead of using lavalink.volume, it uses lavalink.filters.volume which is much different!

- 🛡️ Lavalink Validations
  - It only let's you use the filters / plugins / sources, if Lavalink actually has it enabled

- 🛡️ Client Validations
  - Allows you to whitelist links and even blacklist links / words / domain names, so that it doesn't allow requests you don't want!
  - Checks almost all Lavalink Requests for out of bound errors, right before the request is made to prevent process breaking errors. 

- 🧑‍💻 Memory friendly and easy style
  - Only the required data is displayed, and the store-way & types match Lavalink#IMPLEMENTATION.md

- 😘 Automated Handlings
  - Skips the songs, on TrackEnd, TrackStuck, TrackError, 
  - Destroys the player on channeldelete
  - Pauses / resumes the player if it get's muted / unmuted (server-wide) [soon]
  - ...

- 😁 Much much more!

*** 

# All Events:

## On **Lavalink-Manager**:
> *Player related logs*
- `playerCreate` ➡️ `(player) => {}`
- `playerDestroy` ➡️ `(player, reason) => {}`
- `playerDisconnect` ➡️ `(player, voiceChannelId) => {}`
- `playerMove` ➡️ `(player, oldChannelId, newChannelId) => {}`
  - Updating the voice channel is handled by the client automatically
- `playerSocketClosed` ➡️ `(player, payload) => {}`

> *Track / Manager related logs*
- `trackStart` ➡️ `(player, track, payload) => {}`
- `trackStuck` ➡️ `(player, track, payload) => {}`
- `trackError` ➡️ `(player, track, payload) => {}`
- `trackEnd` ➡️ `(player, track, payload) => {}`
- `queueEnd` ➡️ `(player, track, payload) => {}`
- `playerUpdate` ➡️ `(player) => {}`

```js
client.lavalink.on("create", (node, payload) => {
  console.log(`The Lavalink Node #${node.id} connected`);
});
// for all node based errors:
client.lavalink.on("error", (node, error, payload) => {
  console.error(`The Lavalink Node #${node.id} errored: `, error);
  console.error(`Error-Payload: `, payload)
});
```

## On **Node-Manager**:
- `raw` ➡️ `(node, payload) => {}`
- `disconnect` ➡️ `(node, reason) => {}`
- `connect` ➡️ `(node) => {}`
- `reconnecting` ➡️ `(node) => {}`
- `create` ➡️ `(node) => {}`
- `destroy` ➡️ `(node) => {}`
- `error` ➡️ `(node, error, payload) => {}`
- `resumed` ➡️ `(node, payload, players) => {}`
  - Resuming needs to be handled manually by you *(aka add the players to the manager)*
- e.g.:
```js
client.lavalink.nodeManager.on("create", (node, payload) => {
  console.log(`The Lavalink Node #${node.id} connected`);
});
// for all node based errors:
client.lavalink.nodeManager.on("error", (node, error, payload) => {
  console.error(`The Lavalink Node #${node.id} errored: `, error);
  console.error(`Error-Payload: `, payload)
});
```

## How to log queue logs?
> When creating the manager, add the option: `queueOptions.queueChangesWatcher: new myCustomWatcher(botClient)`
> E.g:
```js
import { QueueChangesWatcher, LavalinkManager } from "lavalink-client";

class myCustomWatcher implements QueueChangesWatcher {
    constructor(client) {
        this.client = client;
    }
    shuffled(guildId, oldStoredQueue, newStoredQueue) {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: Queue got shuffled`)    
    }
    tracksAdd(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got added into the Queue at position #${position}`);    
    }
    tracksRemoved(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
        console.log(`${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got removed from the Queue at position #${position}`);
    }
}

client.lavalink = new LavalinkManager({
  // ... other options
  queueOptions: {
    queueChangesWatcher: new myCustomWatcher(client)
  }
})
```

***

# UpdateLog


## **Version 1.2.0**
- Added `player.stopPlaying()`: When executed it **clears the Queue** and **stops playing**, **without destroying the Player**
- Adjusted `Player.skip()`
  - Added `throwError` Property to: `player.skip(skipTo?:number = 0, throwError?:boolean = true)`.
    - If throwError = false, and no more tracks are in the queue, it won't throw an error and "ignore it". same thing as stopPlaying.
- Added all Events and Methods from the [SponsorBlock Plugin](https://github.com/topi314/Sponsorblock-Plugin).
  - It also validates if the plugin is in the bot, in order so that you can use the functions:
  - `player.getSponsorBlock()` / `node.getSponsorBlock()`
  - `player.setSponsorBlock(segments:SponsorBlockSegment[])` / `node.setSponsorBlock(segments:SponsorBlockSegment[])`
  - `player.deleteSponsorBlock()` / `node.deleteSponsorBlock()`
    - That Plugin adds following **Events** to the **Manager**: `"SegmentsLoaded"`, `"SegmentSkipped"`, `"ChapterStarted"`, `"ChaptersLoaded"`
- Example Bot show example in autoplayFunction how to "disable" / "enable" Autoplay with bot data variables.
- Added `ManagerOptions#emitNewSongsOnly`. If set to true, it won't emit "trackStart" Event, when track.loop is active, or the new current track == the previous (current) track. 
- Added `ManagerOptions#linksBlacklist` which allows user to specify an array of regExp / strings to match query strings (for links / words) and if a match happens it doesn't allow the request (blacklist) 
- Added `ManagerOptions#linksWhitelist` which allows user to specify an array of regExp / strings to match query strings (for links only) and if a match does NOT HAPPEN it doesn't allow the request (whitelist)
- Added `ManagerOptions#linksAllowed` if set to false, it does not allow requests which are links
- Moved `ManaagerOptions#debugOptions` to `ManaagerOptions#advancedOptions.debugOptions`

### **Version 1.2.1**
- Adjusted `player.stopPlaying()`
  - There are now following parameters. `stopPlaying(clearQueue:boolean = true, executeAutoplay:boolean = false)`.
    - On Default it now clears the queue and stops playing. Also it does not execute Autoplay on default. IF you want the function to behave differently, you can use the 2 states for that. 
  - Fixed that it looped the current track if repeatmode === "track" / "queue". (it stops playing and loop stays)
- Implemented a `parseLavalinkConnUrl(connectionUrl:string)` Util Function.
  - It allows you to parse Lavalink Connection Data of a Lavalink Connection Url. 
  Pattern: `lavalink://<nodeId>:<nodeAuthorization(Password)>@<NodeHost>:<NodePort>`
  - Note that the nodeId and NodeAuthorization must be encoded via encodeURIComponents before you provide it into the function.
  - The function will return the following: `{ id: string, authorization: string, host: string, port: number }`
  - Example: `parseLavalinkConnUrl("lavalink://LavalinkNode_1:strong%23password1@localhost:2345")` will give you:
  `{ id: "LavalinkNode_1", authorization: "strong#password1", host: "localhost", port: 2345 }`
    - Note that the password "strong#password1" when encoded turns into "strong%23password1". For more information check the example bot

### **Version 2.0.0**
- Lavalink v4 released, adjusted all features from the stable release, to support it in this client!
```diff

# How to load tracks / stop playing has changed for the node.updatePlayer rest endpoint the Client handles it automatically
- await player.node.updatePlayer({ encodedTrack?: Base64|null, track?: Track|UnresolvedTrack, identifer?: string });
+ await player.node.updatePlayer({ track: { encoded?: Base64|null, identifier?: string }, clientTrack?: Track|UnresolvedTrack });

# To satisfy the changes from lavalink updatePlayer endpoint, player play also got adjusted for that (Most users won't need this feature!)
- await player.play({ encodedTrack?: Base64|null, track?: Track|UnresolvedTrack, identifer?: string });
+ await player.play({ track: { encoded?: Base64|null, identifier?: string }, clientTrack?: Track|UnresolvedTrack });
# However it' still recommended to do it like that:
# first add tracks to the queue
+ await player.queue.add(Track: Track|UnresolvedTrack|(Track|UnresolvedTrack)[]);
# then play the next track from the queue
+ await player.play();

# Node Resuming got supported
# First enable it by doing:
+ await player.node.updateResuming(true, 360_000);
# then when reconnecting to the node add to the node.createeOptions the sessionId: "" of the previous session
# and after  connecting the nodeManager.on("resumed", (node, payload, players) => {}) will be executed, where you can sync the players!

# Node Options got adjusted # It's a property not a method should be treated readonly
+ node.resuming: { enabled: boolean, timeout: number | null }; 

# Player function got added to stop playing without disconnecting
+ player.stopPlaying(clearQueue:boolean = true, executeAutoplay:boolean = false); 

# Node functions for sponsorBlock Plugin (https://github.com/topi314/Sponsorblock-Plugin) got added
+ deleteSponsorBlock(player:Player)
+ setSponsorBlock(player:Player, segments: ["sponsor", "selfpromo", "interaction", "intro", "outro", "preview", "music_offtopic", "filler"])
# only works if you ever set the sponsor blocks once before
+ getSponsorBlock(player:Player)
# Corresponding nodeManager events got added:
+ nodeManager.on("ChapterStarted");
+ nodeManager.on("ChaptersLoaded");
+ nodeManager.on("SegmentsLoaded");
+ nodeManager.on("SegmentSkipped");
# Filters sending got supported for filters.pluginFilters key from lavalink api: https://lavalink.dev/api/rest.html#plugin-filters
# Native implementation for lavaSearch plugin officially updated https://github.com/topi314/LavaSearch
# Native implementation for lavaSrc plugin officially updated https://github.com/topi314/LavaSrc including floweryTTS
# couple other changes, which aren't noticeable by you.

# Lavalink track.userData got added (basically same feature as my custom pluginInfo.clientData system)
# You only get the track.userData data through playerUpdate object
```
In one of the next updates, there will be more queueWatcher options and more custom nodeevents to trace 

Most features of this update got tested, but if you encounter any bugs feel free to open an issue!

## **Version 2.1.0**
- Fixed that, if you skip and have trackloop enabled, it doesn't skip the track
  - I fixed that in the past, but for some reason i removed the fix on accident ig.
- Reworked the Filter Manager for custom filters via [LavalinkFilterPlugin](https://github.com/rohank05/lavalink-filter-plugin) / [LavalinkLavaDSPX-Plugin](https://github.com/devoxin/LavaDSPX-Plugin/)
- Note that the [LavalinkLavaDSPX-Plugin](https://github.com/devoxin/LavaDSPX-Plugin/) is by a Community Member of Lavalink and UNOFFICIAL
  - They now have individual state-variabels (booleans): `player.filterManager.filters.lavalinkLavaDspxPlugin`
    - `player.filterManager.filters.lavalinkLavaDspxPlugin.echo`
    - `player.filterManager.filters.lavalinkLavaDspxPlugin.normalization`
    - `player.filterManager.filters.lavalinkLavaDspxPlugin.highPass`
    - `player.filterManager.filters.lavalinkLavaDspxPlugin.lowPass`
  - and for: `player.filterManager.filters.lavalinkFilterPlugin` (this plugins seems to not work on v4 at the moment)
    - `player.filterManager.filters.lavalinkLavaDspxPlugin.echo`
    - `player.filterManager.filters.lavalinkLavaDspxPlugin.reverb`
  - They also now have individual state-changing-methods: `player.filterManager.lavalinkLavaDspxPlugin`
    - `player.filterManager.lavalinkLavaDspxPlugin.toggleEcho(decay:number, echoLength:number)`
    - `player.filterManager.lavalinkLavaDspxPlugin.toggleNormalization(maxAmplitude:number, adaptive:boolean)`
    - `player.filterManager.lavalinkLavaDspxPlugin.toggleHighPass(boostFactor:number, cutoffFrequency:number)`
    - `player.filterManager.lavalinkLavaDspxPlugin.toggleLowPass(boostFactor:number, cutoffFrequency:number)`
  - and for: `player.filterManager.lavalinkFilterPlugin`
    - `player.filterManager.lavalinkFilterPlugin.toggleEcho(delay:number, decay:number)`
    - `player.filterManager.lavalinkFilterPlugin.toggleReverb(delays:number[], gains:number[])`

## **Version 2.1.1**
- Enforce link searches for users with following searchPlatform Options: "http" | "https" | "link" | "uri"
  - Additionally strongend the code behind that
- Added searchPlatform for local tracks (aka files on the lavalink server...): "local"

## **Version 2.2.0**
- Changed console.error to throw error on queue.utils.sync if no data was provided/found
- Changed undici.fetch to native fetch, but requires nodejs v18+ to support other runtimes, e.g. bun
- Added sourceNames for `bandcamp` (from native lavalink) if it's supported it will use lavalink'S search, else the client search on player.search({ source: "bandcamp" }) (you can also use bcsearch or bc)
- Added sourceName for `phsearch` from the dunktebot plugin, released in v.1.7.0
- Support for youtube still going via the youtube-source plugin (disable youtube for lavalink, and use the plugin instead)
- Exporting events
- Added new debugOption: logCustomSearches
- *(Next version update i will remove the internal interval for position update, to calculations)*
