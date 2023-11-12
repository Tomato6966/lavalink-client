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

Latest stable Version: (currently, unreleased)

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

Check out the [Documentation](https://lc4.gitbook.io/lavalink-client) for **Examples**, and **__detailled__ Docs**, and to figure out **how to get started**. *note: it's not fully done yet (see the docs)*

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
