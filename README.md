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
    <a href="https://tomato6966.github.io/lavalink-client/">
      <img src="https://img.shields.io/badge/Documation-%230288D1.svg?style=for-the-badge&logo=gitbook&logoColor=white" alt="Get Started Now">
    </a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/lavalink-client"><img src="https://nodei.co/npm/lavalink-client.png?downloads=true&stars=true" alt="npm install lavalink-client" /></a>
  </p>
</div>

# Install

Latest stable Version: **`v2.4.0`**

<details><summary>👉 via NPM</summary>

```bash
npm install --save lavalink-client
```


Dev Version: (Current)

```bash
npm install --save  tomato6966/lavalink-client
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

Check out the [Documentation](https://tomato6966.github.io/lavalink-client/)
- See all [Manager-Events, e.g. for Track / player and general errors / logs](https://tomato6966.github.io/lavalink-client/extra/manager-events)
- See all [NodeManager-Events e.g. for Node Errors / logs](https://tomato6966.github.io/lavalink-client/extra/node-events)
- See the Guide on [How to do resuming](https://tomato6966.github.io/lavalink-client/extra/resuming)

# Used in:

- [**Mivator** *(Bot by Chrissy8283 aka @Tomato6966)*](https://discord.gg/5dUb7M2qCj)
- [Betty *(Bot by good friend of Chrissy, aka fb_sean)*](https://betty.cx/)
- **Bots by Contributors:**
  - [Mintone (@appujet)](https://mintone.tech/)
  - [Stelle (@EvilG-MC)](https://github.com/Ganyu-Studios/stelle-music)
  - [Panais (@LucasB25)](https://panais.xyz/)
- **Community:**
  - [Soundy (@idMJA)](https://github.com/idMJA/Soundy)


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

# Sample Configuration


<details><summary>Complete Configuration Example, with all available options</summary>

```ts
import { LavalinkManager, QueueChangesWatcher, QueueStoreManager } from "lavalink-client";
import { RedisClientType } from "redis"; // example for custom queue store
import { Client, GatewayIntentBits } from "discord.js"; // example for a discord bot

// you might want to extend the types of the client, to bind lavalink to it.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

const previouslyUsedSessions = new Map<string, string>(); //nodeManager.on("connect", node => previouslyUsedSessions.set(node.id, node.sessionId))

client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "localhoist",
            host: "localhost",
            port: 2333,
            id: "testnode",
            // get the previously used session, to restart with "resuming" enabled
            sessionId: previouslyUsedSessions.get("testnode"),
            requestSignalTimeoutMS: 3000,
            closeOnError: true,
            heartBeatInterval: 30_000,
            enablePingOnStatsCheck: true,
            retryDelay: 10e3,
            secure: false,
            retryAmount: 5,
        }
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: { // client: client.user
        id: envConfig.clientId, // REQUIRED! (at least after the .init)
        username: "TESTBOT",
    },
    autoSkipOnResolveError: true, // skip song, if resolving an unresolved song fails
    emitNewSongsOnly: true, // don't emit "looping songs"
    playerOptions: {
        // These are the default prevention methods
        maxErrorsPerTime: {
            threshold: 10_000,
            maxAmount: 3,
        },
        // only allow an autoplay function to execute, if the previous function was longer ago than this number.
        minAutoPlayMs: 10_000,

        applyVolumeAsFilter: false,
        clientBasedPositionUpdateInterval: 50, // in ms to up-calc player.position
        defaultSearchPlatform: "ytmsearch",
        volumeDecrementer: 0.75, // on client 100% == on lavalink 75%
        requesterTransformer: requesterTransformer,
        onDisconnect: {
            autoReconnect: true, // automatically attempts a reconnect, if the bot disconnects from the voice channel, if it fails, it get's destroyed
            destroyPlayer: false // overrides autoReconnect and directly destroys the player if the bot disconnects from the vc
        },
        onEmptyQueue: {
            destroyAfterMs: 30_000, // 0 === instantly destroy | don't provide the option, to don't destroy the player
            autoPlayFunction: autoPlayFunction,
        },
        useUnresolvedData: true,
    },
    queueOptions: {
        maxPreviousTracks: 10,
        // only needed if you want and need external storage, don't provide if you don't need to
        queueStore: new myCustomStore(client.redis), // client.redis = new redis()
        // only needed, if you want to watch changes in the queue via a custom class,
        queueChangesWatcher: new myCustomWatcher(client)
    },
    linksAllowed: true,
    // example: don't allow p*rn / youtube links., you can also use a regex pattern if you want.
    // linksBlacklist: ["porn", "youtube.com", "youtu.be"],
    linksBlacklist: [],
    linksWhitelist: [],
    advancedOptions: {
        enableDebugEvents: true,
        maxFilterFixDuration: 600_000, // only allow instafixfilterupdate for tracks sub 10mins
        debugOptions: {
            noAudio: false,
            playerDestroy: {
                dontThrowError: false,
                debugLog: false,
            },
            logCustomSearches: false,
        }
    }
});


client.on("raw", d => client.lavalink.sendRawData(d)); // send raw data to lavalink-client to handle stuff

client.on("ready", () => {
    client.lavalink.init(client.user); // init lavalink
});

// for the custom queue Store create a redis instance
client.redis = createClient({ url: "redis://localhost:6379", password: "securepass" });
client.redis.connect();


// Custom external queue Store
export class myCustomStore implements QueueStoreManager {
    private redis:RedisClientType;
    constructor(redisClient:RedisClientType) {
        this.redis = redisClient;
    }
    async get(guildId): Promise<any> {
        return await this.redis.get(this.id(guildId));
    }
    async set(guildId, stringifiedQueueData): Promise<any> {
        return await this.redis.set(this.id(guildId), stringifiedQueueData);
    }
    async delete(guildId): Promise<any> {
        return await this.redis.del(this.id(guildId));
    }
    async parse(stringifiedQueueData): Promise<Partial<StoredQueue>> {
        return JSON.parse(stringifiedQueueData);
    }
    async stringify(parsedQueueData): Promise<any> {
        return JSON.stringify(parsedQueueData);
    }
    private id(guildId) {
        return `lavalinkqueue_${guildId}`; // transform the id to your belikings
    }
}

// Custom Queue Watcher Functions
export class myCustomWatcher implements QueueChangesWatcher {
    constructor() {
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
```

</details>



```ts
import { LavalinkManager } from "lavalink-client";
import { Client, GatewayIntentBits } from "discord.js"; // example for a discord bot

// you might want to extend the types of the client, to bind lavalink to it.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// create instance
client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "localhoist",
            host: "localhost",
            port: 2333,
            id: "testnode",
        }
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: envConfig.clientId,
        username: "TESTBOT",
    },
});

client.on("raw", d => client.lavalink.sendRawData(d)); // send raw data to lavalink-client to handle stuff

client.on("ready", () => {
    client.lavalink.init(client.user); // init lavalink
});

```

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
- e.g. of listening to node events:
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

## How to do resuming

1. You need to enable resuming on a __connected__ Lavalink node : **` node.updateSession(true, 360e3) `**
2. The NodeManager#resumed event will emit when the node resumes, you retrieves all fetchedPlayers (fetched by the client), and thus all you need to do is re-create all player instances (and possibly the queues too)
  - For that is the queuestore useful
  - To save the playerData you can utilize smt like playerUpdate event.

## Resuming full Example
Full code sample: can be found on the [Testbot in here](https://github.com/Tomato6966/lavalink-client/blob/main/testBot/Utils/handleResuming.ts)
```js
// but here is the schema:
client.lavalink.nodeManager.on("connect", (node) => node.updateSession(true, 360e3));
client.lavalink.nodeManager.on("resumed", (node, payload, fetchedPlayers) => {
  // create players:
  for(const fetchedPlayer of fetchedPlayers) {
    // fetchedPlayer is the live data from lavalink
    // saved Player data is the config you should save in a database / file or smt
    const savedPlayerData = await getSavedPlayerData(fetchedPlayer.guildId);
    const player = client.lavalink.createPlayer({
       guildId: fetchedPlayer.guildId,
    });
    // if lavalink says the bot got disconnected, we can skip the resuming, or force reconnect whatever you want!, here we choose to not do anything and thus delete the saved player data
    if(!data.state.connected) {
        console.log("skipping resuming player, because it already disconnected");
        await deletedSavedPlayerData(data.guildId);
        continue;
    }
    // now you can create the player based on the live and saved data
    const player = client.lavalink.createPlayer({
        guildId: data.guildId,
        node: node.id,
        // you need to update the volume of the player by the volume of lavalink which might got decremented by the volume decrementer
        volume: client.lavalink.options.playerOptions?.volumeDecrementer
        ? Math.round(data.volume / client.lavalink.options.playerOptions.volumeDecrementer)
        : data.volume,
        // all of the following options are needed to be provided by some sort of player saving
        voiceChannelId: dataOfSaving.voiceChannelId,
        textChannelId: dataOfSaving.textChannelId,
        // all of the following options can either be saved too, or you can use pre-defined defaults
        selfDeaf: dataOfSaving.options?.selfDeaf || true,
        selfMute: dataOfSaving.options?.selfMute || false,

        applyVolumeAsFilter: dataOfSaving.options.applyVolumeAsFilter,
        instaUpdateFiltersFix: dataOfSaving.options.instaUpdateFiltersFix,
        vcRegion: dataOfSaving.options.vcRegion,
    });

    // player.voice = data.voice;
    // normally just player.voice is enough, but if you restart the entire bot, you need to create a new connection, thus call player.connect();
    await player.connect();

    player.filterManager.data = data.filters; // override the filters data
    await player.queue.utils.sync(true, false); // get the queue data including the current track (for the requester)
    // override the current track with the data from lavalink
    if(data.track) player.queue.current = client.lavalink.utils.buildTrack(data.track, player.queue.current?.requester || client.user);
    // override the position of the player
    player.lastPosition = data.state.position;
    player.lastPositionChange = Date.now();
    // you can also override the ping of the player, or wait about 30s till it's done automatically
    player.ping.lavalink = data.state.ping;
    // important to have skipping work correctly later
    player.paused = data.paused;
    player.playing = !data.paused && !!data.track;
    // That's about it
  }
})
client.lavalink.on("playerUpdate", (oldPlayer, newPlayer) => { // automatically sync player data on updates. if you don'T want to save everything you can instead also just save the data on playerCreate
    setSavedPlayerData(newPlayer.toJSON());
});
// delete the player again
client.lavalink.on("playerDestroy", (player) => {
    deleteSavedPlayerData(player.guildId);
})
```

***


### How to use flowertts with custom options

- First enable flowertts within the lava-src plugin
- Then make sure to pass through the extraQueryUrlParams object

```js
const query = interaction.options.getString("text");
const voice = interaction.options.getString("voice");

const extraParams = new URLSearchParams();
if(voice) extraParams.append(`voice`, voice);

// all params for flowertts can be found here: https://flowery.pw/docs
const response = await player.search({
  query: `${query}`,
  extraQueryUrlParams: extraParams, // as of my knowledge this is currently only used for flowertts, adjusting the playback url dynamically mid-request
  source: "ftts"
}, interaction.user);
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
+ await player.node.updateSession(true, 360_000);
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

## **Version 2.2.1**
- Player position is now calculated instead of using intervals
- Instaplayer fix update now requires quite good internet connection on the lavalink server due to removal of intervals for updating player.position (everything above 300mbps should be good)
- Internal updates for handling query params and url-requests (url-parsing) to fix quite few bugs and make the code more readable, now you don't have to ever provide stuff encoded via encodeURIComponent anymore.
- Added a bunch of jsdoc information, to make the autogenerated docs more accurate!

- Because of the adjustments from the encoding, you now need to pass url params for stuff like flowery tts like this:

```js
const query = interaction.options.getString("text");
const voice = interaction.options.getString("voice");

const extraParams = new URLSearchParams();
if(voice) extraParams.append(`voice`, voice);

// all params for flowertts can be found here: https://flowery.pw/docs
const response = await player.search({
  query: `${query}`,
  extraQueryUrlParams: extraParams, // as of my knowledge this is currently only used for flowertts, adjusting the playback url dynamically mid-request
  source: "ftts"
}, interaction.user);
```


## **Version 2.2.2**
- Fixed a bug in player.pause() where when you pause the track longer than the left over currentTrack.info.duration is, then it would auto skip the track on resume.
- Fixed the handling of the previous track array ( sometimes it adds "null", due to lavalink errors )
- Added new functions for the queue, to make migrations and coding easier for beginners,
  - ` const previousTrack = await player.queue.shiftPrevious() ` -> removes the previously played track from the player.queue.previous array, and returns it, so you can use it for something like "play previous"
    - *Neat 1-liner: ` await player.queue.shiftPrevious().then(clientTrack => player.play({ clientTrack })) `*
  - ` await player.queue.remove(removeQuery) ` -> Remove function to remove stuff from the queue.tracks array., following params are valid:
    - Array of Tracks / UnresolvedTracks, e.g. ` await player.queue.remove( player.queue.tracks.slice(4, 10) ) ` *(would remove tracks from #4 (incl.) to #10 (excl.) aka those indexes: 4, 5, 6, 7, 8, 9 - this is how array.slice works)*
    - Single Track / UnresolveTrack, e.g. ` await player.queue.remove(player.queue.tracks[player.queue.tracks.length - 1]); ` *(would remove the last track)*
    - Array of track-indexes, e.g. ` await player.queue.remove([1, 4, 5]) ` *(Would remove track #1, #4 and #5)*
    - Single track index, e.g. ` await player.queue.remove(5) ` *(would remove the #5 track from the queue)*
    - **NOTE:** I still highly recommend, to use the ` player.queue.splice() ` function for mutating the queue:
       - it is possible to remove single tracks, multiple tracks and insert tracks at specific positions!
    - *the remove function haven't been fully tested yet*
  - Added `track.pluginInfo.clientData?.previousTrack` handling:
    - If a track has this property in the pluginInfo in the clientData object set to "true" then it won't get added to the previous track array. Example:
```js
const previousTrack = await player.queue.shiftPrevious();
if(previousTrack) {
    const previousClientData = previousTrack.pluginInfo.clientData || {};
    previousTrack.pluginInfo.clientData = { previousTrack: true, ...previousClientData }
    await player.play({ clientTrack: previousTrack });
}
```


## **Version 2.3.0**

- Added a heartbeat + ping-pong system to check wether the client is still connected to the node, if the node doesn't receive a ping in time, it will destroy the node and thus cause a reconnect.
- For that following new nodeOptions got added:
  - `enablePingOnStatsCheck: boolean` (default: true)
  - `heartBeatInterval: number` (default: 30_000)
  - Added new Property on a node:
    - `isAlive: boolean` (if it's false, then it's not connected to the node anymore, and will AUTOMATICALLY Cause a reconnect within the heartBeatInterval)
    - `heartBeatPing: number` (the ping it takes lavalink to respond to the acknowledge of heartbeat)
  - Added new NodeManager Events:
    - `reconnectinprogress` (when the client internal reconnect system is triggered, the actual reconnect gets triggered by the node after your retryDelay)
- Refactored internal code for better readability and maintainability
- Removed several intermediate promises
- Added new types for better type safety
- Updated types for better type safety
- Reduced default retryDelay from 30s to 10s
- Added example on the testbot how to store player data easily and how to use the resume feature, and updated the Resuming Example in the README [jump](#how-to-do-resuming) by adding a [full example](#resuming-full-example)

- **"Breaking Change" for providing track / clientTrack for player.play()**
  - Instead of adding the track to the queue and skipping to it, they get directly played by lavalink through replacing the track.
  - To make this work, we need to pass the transformed requester object to the userData of the track. (all handled by the client)
  - *This is technically better than skipping to a track but i wanted to point it out.*
    - You can play with clientTrack like this: `player.play({ clientTrack: searchResult.tracks[0] })`
    - You can play with just track like this: `player.play({ track: { encoded: "base64string..." }, requester: interaction.user })`


## **Version 2.3.1**

- Fixed Export, where types of Manager weren't exported correctly
- Fixed Dist Folder containing old, left over not needed files

## **Version 2.3.2** / **Version 2.3.3**
- Added Missing function calls for the QueueWatcher of tracksRemoved within the queue.remove() function:
- Added new DestroyReasons:
    - TrackStuckMaxTracksErroredPerTime
    - TrackErrorMaxTracksErroredPerTime
- Added new Prevention Systems for CrashbackLoop recognitions:
    - `this.NodeManager.LavalinkManager.options.playerOptions.maxErrorsPerTime`:
        - object: `{ threshold: number, maxAmount: number }` (set threshold to 0 or maxAmount to -1 to disable)
        - Default: `{ threshold: 10_000, maxAmount: 3 }`
        - If there are trackError or trackStuck Events > maxAmount within the given treshhold, the player will be destroyed prevent more errors and thus potential ratelimits.
    - `this.NodeManager.LavalinkManager.options.playerOptions.minAutoPlayMs`:
        - number: `10_000` (default)
        - If there is an AutoplayFunction, and it get's executed before that threshold, than it won't trigger the autoplay function again. *(this is ignored for when the player is skipped)*
        - This prevents autoplays from happeneing on a crashbackloop
        - Set to `0` to disable
- **Added new Event "debug":**
    - `LavalinkManager#debug(event:DebugEvents, data:{ state: "log" | "warn" | "error", message:string, functionLayer:string, error?:Error })`
    - This function Event will emit, when the following option is set to **` true `**: `LavalinkManager.options.advancedOptions.enableDebugEvents`
    - You can use the **` DebugEvents `**  Enum to listen to specific events and only show those you care
    - You can filter for the **` data.state `** to only show the certain log-level state
    - The **` functionLayer `** string will show you where the debug event was triggered from
    - The **` message `** string will show what is debugged
    - The **` error `** object will show you the error that happened, if there was one.
    - *This took quite some time to code, and i am sure there are still many logs you might want, feel free to open an issue


## **Version 2.3.4**
- Improved the package bundling with tsc-alias, to export files with file types
- Added package.json to exported dist, for easier parsing ability and compatibility with older and newer node versions
- Added error handling for resolving unresolved tracks on trackend


## **Version 2.3.5**
- FIXED not able to import :: Accidentally removed tsc-alias configuration, which made importing not work
- FIXED autoplay not working :: Accidentally added an invalid if statement, which made autoplay not working anymore (during the if statement  to not prevent autoplay spam)
- Added a new AutoplayExecution Debug Log
- Added more samples to the Testbot related configuration


## **Version 2.3.6**
- Added Lyrics Support:
  - New Player Functions:
    - **` const lyrics = await player.getCurrentLyrics(false); `** -> *Get lyrics of current playing track*
    - **` const lyrics = await player.getLyrics(track, true); `** -> *Get lyrics of a specific track with ignoring it's sources*
    - **` player.subscribeLyrics(); `** -> *Subscribe this guild to retrieve "live lyrics" as the song is *playing
    - **` player.unsubscribeLyrics(); `** -> *Unsubscribe from lyrics
  - New Node Functions ( same as from player, just so you can access it without player too ):*
    - **` const lyrics = await player.node.lyrics.getCurrent(player.guildId, false); `**
    - **` const lyrics = await player.node.lyrics.get(track, true); `**
    - **` player.node.lyrics.subscribe(player.guildId); `**
    - **` player.node.lyrics.unsubscribe(player.guildId); `**
  - New Manager Event sfor Lyrics:
    - **` lavalink.on("LyricsLine", (player, track, lyricsLine) => {}); `**
    - **` lavalink.on("LyricsFound", (player, track, data) => {}); `**
    - **` lavalink.on("LyricsNotFound", (player, track, lyricsLine) => {}); `**


## **Version 2.4.0**
- Refactored a little the project folder Structure
- Added PR Packages to install all commits / packages at once `https://pkg.pr.new/Tomato6966/lavalink-client`
- Removed the dist folder, and added prepare Scripts
- Added attributes for git linting
- Removed the old (gitbook) documentation, and swapped it to a NEW TSDOC Themed Documentation via astro.dev and mdx
- Added new player events:
    - **`playerMuteChange`**** ➡️ **`(player, selfMuted, serverMuted) => {}`
    *Triggered when the player's voice state related to muting changed*

    - **`playerDeafChange`** ➡️ `(player, selfDeafed, serverDeafed) => {}`
    *Triggered when the player's voice state related to deafing changed*

    - **`playerSuppressChange`** ➡️ `(player, suppress) => {}`
    *Triggered when the player's voice state related to suppressing changed*

    - **`playerQueueEmptyStart`** ➡️ `(player, timeoutMs) => {}`
    *Triggered when the queue empty handler started (the timeout)*

    - **`playerQueueEmptyEnd`** ➡️ `(player) => {}`
    *Triggered when the queue empty handler finished (successfully) and thus destroyed the player*

    - **`playerQueueEmptyCancel`** ➡️ `(player) => {}`
    *Triggered when the queue empty handler cancelled (e.g. because a new track got added)*

    ~~- **`playerVoiceEmptyStart`** ➡️ `(player, timeoutMs) => {}`~~
    ~~*Triggered when the voice empty handler started (the timeout)*~~
    *Removed again because of memory overhall and not wanting to handle voice states*

    ~~- **`playerVoiceEmptyEnd`** ➡️ `(player) => {}`~~
    ~~*Triggered when the voice empty handler finished (successfully) and thus destroyed the player*~~
    *Removed again because of memory overhall and not wanting to handle voice states*

    ~~- **`playerVoiceEmptyCancel`** ➡️ `(player, userId) => {}`~~
    ~~*Triggered when the voice empty handler cancelled (e.g. when a user rejoined)*~~
    *Removed again because of memory overhall and not wanting to handle voice states*

    - **`playerVoiceJoin`** ➡️ `(player, userId) => {}`~~
    *Added instead of the playerVoiceEmpty handler, emitted when a user joins the player-vc while there is a player*
    *Allows you to inmplement a custom playerVoiceEmpty handler*

    - **`playerVoiceLeave`** ➡️ `(player, userId) => {}`~~
    *Added instead of the playerVoiceEmpty handler, emitted when a user leaves (or. switches away) the player-vc while there is a player*
    *Allows you to inmplement a custom playerVoiceEmpty handler*

- Added the new events and configuration to the docs

## **Version 2.4.1**

- Did some cleanup and comment removal + removed the playerVoiceEmptyStart because it would mean i'd need to add voice-state tracking, which wasn't the plan of doing by the client.

## **Verison 2.4.2**

- Merged [PR#78](https://github.com/Tomato6966/lavalink-client/pull/78) from @hwangsihu - Added the configs to eslint ignore
- Merged [PR#80](https://github.com/Tomato6966/lavalink-client/pull/80) from @EvilG-MC - Argument Typo fix in resume event type declaration
- Merged [PR#83](https://github.com/Tomato6966/lavalink-client/pull/83) from @EvilG-MC - Fix if statement in Node#syncPlayerData() to allow syncing of "single entry objects"
- Some minor improvements by removing unnecessary spreading

## **Version 2.4.3**
- `managerOptions#playerOptions.onDisconnect.autoReconnect`:
  - Added the option `managerOptions#playerOptions.onDisconnect.autoReconnectOnlyWithTracks` to control wether to try reconnecting only when there are tracks in the queue / current track or not
  - Added a new debug log for that
  - Added the try to play the next track if there is no current track
    - *There was a problem trying to auto-reconnect on-Disconnect while the queue was empty, which caused the player to get destroyed by that and log the error in console "`There is no Track in the Queue, nor provided in the PlayOptions`"*
    - *Now you have to handle that case manually if you want to or set autoReconnectOnlyWithTracks to false (default)*


## **Version 2.4.4 - Version 2.4.6**
- `player.changeNode()` is fixed and works - thanks to @PandaIN95
- The code got re-formatted and re-structured, no code-changes are needed to be made, but it's now cleaner & more readable in some areas
- The same for the testbot Folder(s), also it imports lavalink-client directly, so you can just copy it and move on from it.
- Some minor Fixess:
  - Autoplay sometimes doesn't get called when previousAutoplay call failed.
  - remove structuredClone so that it works in bun more stable
  - Player Options Validation also allows single property objects
  - Some typos were fixed



## **Version 2.5.0**
- Deps got updated
- Handling of parsing url got updated to use the URL object
- Flowerytts requests needs to be changed now:

```js
const query = "Hello World How are you?";
const voice = "Ava";
const speed = "1.0";

const fttsParams = new URLSearchParams();
if(voice) fttsParams.append("voice", voice);
if(speed) fttsParams.append("speed", speed);

const response = await player.search({
    // For flowerytts you need to send a URL
    // and if you want to add optiojns, this is how you add the params to the query..
    query: `${encodeURI(query)}${fttsParams.size ? `?${fttsParams.toString()}` : ""}`,
    source: "ftts"
}, interaction.user);
```
