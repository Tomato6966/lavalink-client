---
description: The main Base-Manager of this Package
---

# LavalinkManager

**Type:** [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class) _extends_ [node:EventEmitter](https://nodejs.org/dist/latest/docs/api/events.html#events\_class\_eventemitter)

## Constructor

```javascript
new LavalinkManager(options:ManagerOptions)
```

## <mark style="color:red;">Import</mark>

{% tabs %}
{% tab title="Typescript / ESM" %}
<pre class="language-typescript" data-title="index.ts" data-line-numbers><code class="lang-typescript"><strong>import { LavalinkManager } from "lavalink-client";
</strong></code></pre>
{% endtab %}

{% tab title="JavaScript (cjs)" %}
{% code title="index.js" lineNumbers="true" %}
```javascript
const { LavalinkManager } = require("lavalink-client");
```
{% endcode %}
{% endtab %}
{% endtabs %}

## <mark style="color:red;">Overview</mark>

| Properties                     | Methods                                                                                                                                   | Event-Listeners                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [initiated](./#.initated)      | [createPlayer()](./#.createplayer-options-playeroptions)                                                                                  | [trackStart](./#trackstart)               |
| [useable](./#.useable)         | [getPlayer()](./#.getplayer-guildid-string)                                                                                               | [trackEnd](./#trackend)                   |
| [options](./#.options)         | [deletePlayer()](./#.deleteplayer-guildid-string)                                                                                         | [trackStuck](./#trackstuck)               |
| [players](./#.players)         | [init()](./#.init-clientdata-botclientoptions-important) <mark style="color:red;">IMPORTANT</mark>                                        | [queueEnd](./#queueend)                   |
| [nodeManager](./#.nodemanager) | [sendRawData()](./#.sendrawdata-data-voicepacket-or-voiceserver-or-voicestate-or-any-important) <mark style="color:red;">IMPORTANT</mark> | [playerCreate](./#playercreate)           |
| [utils](./#.utils)             |                                                                                                                                           | [playerMove](./#playermove)               |
|                                |                                                                                                                                           | [playerDisconnect](./#playerdisconnect)   |
|                                |                                                                                                                                           | [playerSocketClose](./#playersocketclose) |
|                                |                                                                                                                                           | [playerDestroy](./#playerdestroy)         |
|                                |                                                                                                                                           | [playerUpdate](./#playerupdate)           |

### **Check out** [**Example Creations** ](./#example-creations)**down below**

***

## <mark style="color:blue;">Properties</mark>

### <mark style="color:blue;">.initated</mark>

> _If the Manager was initated_

**Type**: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

### <mark style="color:blue;">.useable</mark>

> _If the Manager is useable (If at least 1 Node is connected)_

**Type**: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

### <mark style="color:blue;">.options</mark>

> _The options from the Manager_

**Type**: [ManagerOptions](manager-options/)

### <mark style="color:blue;">.players</mark>

> _All the Players of the Manager_

**Type**_:_ [_MiniMap_](../other-utils-and-classes/minimap.md)_\<guildId:_[_string_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/String)_,_ [_Player_](../player/)_>_

### <mark style="color:blue;">.nodeManager</mark>

> _The Node Manager of the Manager_

**Type**_:_ [_NodeManager_](../nodemanager/)

### <mark style="color:blue;">.utils</mark>

> _The Manager's Utils_

**Type**_:_ [_ManagerUtils_](managerutils.md)

***

## <mark style="color:purple;">Methods</mark>

### <mark style="color:purple;">.init(clientData:</mark> [BotClientOptions](../../botclientoptions.md)<mark style="color:purple;">)</mark> <mark style="color:red;">IMPORTANT!</mark>

> _Initializes the Manager and connects all Nodes_

**Returns**: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Promise)<[LavalinkManager](./)>

<pre class="language-typescript"><code class="lang-typescript"><strong>botClient.on("ready", async () => { // only init it when the Bot is ready...
</strong><strong>  await botClient.lavalink.init({ 
</strong><strong>    id: botClient.user.id, 
</strong><strong>    username: botclient.user.username
</strong><strong>  });
</strong><strong>});
</strong></code></pre>

### <mark style="color:purple;">.createPlayer(options:</mark> [PlayerOptions](../player/playeroptions.md)<mark style="color:purple;">)</mark>

> _Create or get a Player_

**Returns**: [Player](../player/)

```typescript
const newPlayer = await client.lavalink.createPlayer({
  guildId: interaction.guildId, 
  voiceChannelId: interaction.member.voice?.channelId, 
  textChannelId: interaction.channelId, // (optional)
  selfDeaf: true, // (optional)
  selfMute: false, // (optional)
  volume: client.defaultVolume,  // (optional) default volume
  instaUpdateFiltersFix: true, // (optional)
  applyVolumeAsFilter: false, // (optional)
  // node: "YOUR_NODE_ID", // (optional)
  // vcRegion: interaction.member.voice?.channel?.rtcRegion // (optional)
});
```

### <mark style="color:purple;">.getPlayer(guildId:</mark>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/String)<mark style="color:purple;">)</mark>

> _Create a Player_

**Returns**: [Player](../player/) | [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/undefined)

<pre class="language-typescript"><code class="lang-typescript"><strong>const player = client.lavalink.getPlayer(interaction.guildId);
</strong></code></pre>

{% hint style="info" %}
Important Conditions to check:

* player is not undefined
* player is connected to a VoiceChannel
* user in a VoiceChannel && player in same VoiceChannel as user
* player.node is Connected
* player is playing / there is a current song in player.queue
{% endhint %}

### <mark style="color:purple;">.deletePlayer(guildId:</mark>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/String)<mark style="color:purple;">)</mark>

> _Removes a Player from the saved_ [_MiniMap_](../other-utils-and-classes/minimap.md)_, needs to be destroyed first_

**Returns**: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

<pre class="language-typescript"><code class="lang-typescript"><strong>client.lavalink.deletePlayer(oldPlayer?.guildId || interaction.guildId);
</strong></code></pre>

### <mark style="color:purple;">.sendRawData(data :</mark> <mark style="color:orange;">VoicePacket | VoiceServer | VoiceState | any</mark><mark style="color:purple;">)</mark> <mark style="color:red;">IMPORTANT!</mark>

> _Sends Raw Discord's Clients Event Data to the Manager_

**Returns**: [void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

<pre class="language-typescript"><code class="lang-typescript"><strong>botClient.on("raw", (data) => client.lavalink.sendRawData(data));
</strong><strong>
</strong></code></pre>

***

## <mark style="color:red;">Event-Listeners</mark>

> _All Events you can listen to on the LavalinkManager Class_

### <mark style="color:red;">trackStart</mark>

> _Emitted whenever a Track plays_&#x20;

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track/">Track</a></td><td>The current playing track (player.queue.current)</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackstartevent.md">TrackStartEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("trackStart", (player, track, payload) => { });
```

### <mark style="color:red;">trackEnd</mark>

> _Emitted whenever a Track finished playing._

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track/">Track</a></td><td>The Track that finished Playing</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackendevent.md">TrackEndEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("trackEnd", (player, track, payload) => { });
```

### <mark style="color:red;">trackStuck</mark>

> _Emitted whenever a Track got stuck while playing_

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track/">Track</a></td><td>The Track that got stuck</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackstuckevent.md">TrackStuckEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("trackStuck", (player, track, payload) => { });
```

### <mark style="color:red;">trackError</mark>

> Emitted whenever a Track errored

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="193">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track/">Track</a> | <a href="../other-types/unresolvedtrack.md">UnresolvedTrack</a></td><td>The Track that Errored</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackexceptionevent.md">TrackExceptionEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("trackError", (player, track, payload) => { });
```

### <mark style="color:red;">queueEnd</mark>

> Emitted when the track Ended, but there are no more tracks in the queue
>
> (trackEnd, does NOT get exexcuted)&#x20;

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="198">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track/">Track</a></td><td>The last played track</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackendevent.md">TrackEndEvent</a> | <a href="../other-types/payloads/trackstuckevent.md">TrackStuckEvent</a> | <a href="../other-types/payloads/trackexceptionevent.md">TrackExceptionEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("queueEnd", (player, track, payload) => { });
```

### <mark style="color:red;">playerCreate</mark>

> Emitted whenver a Player get's created

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The created Player</td></tr></tbody></table>

```typescript
client.lavalink.on("playerCreate", (player) => { });
```

### <mark style="color:red;">playerMove</mark>

> Emitted whenever a Player get's moved between Voice Channels&#x20;

<table><thead><tr><th width="201.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>oldVoiceChannelId</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>old Voice Channel Id</td></tr><tr><td>newVoiceChannelId</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>new Voice Channel Id</td></tr></tbody></table>

```typescript
client.lavalink.on("playerMove", (player, oldVCId, newVCId) => { });
```

### <mark style="color:red;">playerDisconnect</mark>

> Emitted whenever a player is disconnected from a channel&#x20;

<table><thead><tr><th width="167.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>voiceChannelId</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The disconnected voice Channel</td></tr></tbody></table>

```typescript
client.lavalink.on("playerDisconnect", (player, voiceChannelId) => { });
```

### <mark style="color:red;">playerSocketClose</mark>

> Emitted when a Node-Socket got closed for a specific Player

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="216">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/websocketclosedevent.md">WebSocketClosedEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("playerSocketClose", (player, track, payload) => { });
```

### <mark style="color:red;">playerDestroy</mark>

> Emitted whenever a Player got destroyed

<table><thead><tr><th width="170.33333333333331">Parameter</th><th width="228">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Destroyed Player</td></tr><tr><td>destroyReason</td><td>?<a href="../player/playerdestroyreasons.md">PlayerDestroyReasons</a></td><td>The Destroy Reason (if provided)</td></tr></tbody></table>

```typescript
client.lavalink.on("playerDestroy", (player, destroyReason) => { });
```

### <mark style="color:red;">playerUpdate</mark>

> Emitted whenever a Player get's update from Lavalink's playerUpdate Event&#x20;

<table><thead><tr><th width="160">Parameter</th><th width="186.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>oldPlayerJson</td><td><a href="../player/playertypes/playerjson.md">PlayerJson</a></td><td>Player Data before it was udpated</td></tr><tr><td>newPlayer</td><td><a href="../player/">Player</a></td><td>Afterwards the Player got updated</td></tr></tbody></table>

```typescript
client.lavalink.on("playerUpdate", (oldPlayerJson, newPlayer) => { });
```

## <mark style="color:red;">Example-Creations</mark>

<details>

<summary>Example Creation</summary>

```typescript
import { Client, GatewayIntentBits } from "discord.js";
import { createClient, RedisClientType } from 'redis';
import { LavalinkManager } from "../src";
```

```typescript
// The Bot Client, here a discord.js one
const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates ]
}) as Client & { redis: RedisClientType, lavalink: LavalinkManager };
```

<pre class="language-typescript"><code class="lang-typescript"><strong>client.lavalink = new LavalinkManager({
</strong>    nodes: [
        {
            authorization: "yourverystrongpassword",
            host: "localhost",
            port: 2333,
            id: "testnode",
            requestTimeout: 10000,
        }
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: envConfig.clientId, // REQUIRED! (at least after the .init)
        username: "TESTBOT"
    },
    playerOptions: {
        applyVolumeAsFilter: false,
        clientBasedPositionUpdateInterval: 50,
        defaultSearchPlatform: "ytmsearch",
        volumeDecrementer: 0.75, // on client 100% == on lavalink 75%
        onDisconnect: {
            autoReconnect: true, // automatically attempts a reconnect, if the bot disconnects from the voice channel, if it fails, it get's destroyed
            destroyPlayer: false // overrides autoReconnect and directly destroys the player if the bot disconnects from the vc
        },
        onEmptyQueue: {
            destroyAfterMs: 30_000, // 0 === instantly destroy | don't provide the option, to don't destroy the player
        },
        useUnresolvedData: true
    },
    queueOptions: {
        maxPreviousTracks: 10
    },
});
</code></pre>

Finally, initatlize the Manager and send Raw Data!

```typescript
client.on("ready", async () => {
  await client.lavalink.init({
    id: client.user.id,
    username: client.user.username
  });
});

client.on("raw", data => client.lavalink.sendRawData(data));
```

</details>

### Advanced Example Creation

<details>

<summary>Example with <mark style="color:red;">Redis-Queue</mark>, <mark style="color:red;">Request-Transformer</mark>, <mark style="color:red;">Autoplay Function</mark>, ...</summary>

```typescript
import { Client, GatewayIntentBits } from "discord.js";
import { createClient, RedisClientType } from 'redis';
import { LavalinkManager, QueueStoreManager , QueueChangesWatcher } from "lavalink-client";
```

```typescript
// The Bot Client, here a discord.js one
const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates ]
}) as Client & { redis: RedisClientType, lavalink: LavalinkManager };
```

```typescript
// The Custom Redis Server
client.redis = createClient({ 
  url: "redis://localhost:6379", 
  password: "your_very_strong_password"
});
client.redis.connect();
client.redis.on("error", (err) => console.log('Redis Client Error', err));
```

```typescript
// Create the Lavalink Server
client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "yourverystrongpassword",
            host: "localhost",
            port: 2333,
            id: "testnode",
            requestTimeout: 10000,
        }
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: envConfig.clientId, // REQUIRED! (at least after the .init)
        username: "TESTBOT"
    },
    playerOptions: {
        applyVolumeAsFilter: false,
        clientBasedPositionUpdateInterval: 50,
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
        useUnresolvedData: true
    },
    queueOptions: {
        maxPreviousTracks: 10,
        queueStore: new myCustomStore(client.redis),
        queueChangesWatcher: new myCustomWatcher(client)
    },
});
```

Custom Queue Store Class (Saving the queue on a redis server)

```typescript
export class myCustomStore implements QueueStoreManager {
    private redis:RedisClientType;
    constructor(redisClient:RedisClientType) {
        this.redis = redisClient;
    }
    async get(guildId): Promise<any> {
        return await this.redis.get(this.id(guildId));
    }
    async set(guildId, stringifiedQueueData): Promise<any> {
        // await this.delete(guildId); // redis requires you to delete it first;
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
    // you can add more utils if you need to...
    private id(guildId) {
        return `lavalinkqueue_${guildId}`; // transform the id
    }
}

```

Custom Queue Changes Watcher Class, for seeing changes within the Queue

```typescript
export class myCustomWatcher implements QueueChangesWatcher {
    private client:BotClient;
    constructor(client:BotClient) {
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
```

Custom Autoplay function, which get's executed, before the "queueEnd" Event fires, and if there is a new track added in the queue, then it plays it. else "queueEnd" will fire

```typescript
export const autoPlayFunction = async (player, lastPlayedTrack) => {
    if(lastPlayedTrack.info.sourceName === "spotify") {
        const filtered = player.queue.previous.filter(v => v.info.sourceName === "spotify").slice(0, 5);
        const ids = filtered.map(v => v.info.identifier || v.info.uri.split("/")?.reverse()?.[0] || v.info.uri.split("/")?.reverse()?.[1]);
        if(ids.length >= 2) {
            const res = await player.search({
                query: `seed_tracks=${ids.join(",")}`, //`seed_artists=${artistIds.join(",")}&seed_genres=${genre.join(",")}&seed_tracks=${trackIds.join(",")}`;
                source: "sprec"
            }, lastPlayedTrack.requester).then(response => {
                response.tracks = response.tracks.filter(v => v.info.identifier !== lastPlayedTrack.info.identifier); // remove the lastPlayed track if it's in there..
                return response;
            }).catch(console.warn);
            if(res && res.tracks.length) await player.queue.add(res.tracks.slice(0, 5).map(track => { 
                // transform the track plugininfo so you can figure out if the track is from autoplay or not. 
                track.pluginInfo.clientData = { ...(track.pluginInfo.clientData||{}), fromAutoplay: true }; 
                return track;
            })); else console.log("Spotify - NOTHING GOT ADDED");
        }
        return;
    }
    if(lastPlayedTrack.info.sourceName === "youtube" || lastPlayedTrack.info.sourceName === "youtubemusic") {
        const res = await player.search({
            query:`https://www.youtube.com/watch?v=${lastPlayedTrack.info.identifier}&list=RD${lastPlayedTrack.info.identifier}`,
            source: "youtube"
        }, lastPlayedTrack.requester).then(response => {
            response.tracks = response.tracks.filter(v => v.info.identifier !== lastPlayedTrack.info.identifier); // remove the lastPlayed track if it's in there..
            return response;
        }).catch(console.warn);
        if(res && res.tracks.length) await player.queue.add(res.tracks.slice(0, 5).map(track => { 
            // transform the track plugininfo so you can figure out if the track is from autoplay or not. 
            track.pluginInfo.clientData = { ...(track.pluginInfo.clientData||{}), fromAutoplay: true }; 
            return track;
        })); else console.log("YT - NOTHING GOT ADDED");
        return;
    }
    return
}
```

Custom requestTransformer Function, which allows you to provide just a User Object into the "requester" parameter(s) and then transform it to save memory!\
Attention: This function might get executed on already transformed requesters, if you re-use it.

```typescript
export const requesterTransformer = (requester:any):CustomRequester => {
    // if it's already the transformed requester
    if(typeof requester === "object" && "avatar" in requester && Object.keys(requester).length === 3) return requester as CustomRequester; 
    // if it's still a discord.js User
    if(typeof requester === "object" && "displayAvatarURL" in requester) { // it's a user
        return {
            id: requester.id,
            username: requester.username,
            avatar: requester.displayAvatarURL(),
        }
    }
    // if it's non of the above
    return { id: requester!.toString(), username: "unknown" }; // reteurn something that makes sense for you!
}

export interface CustomRequester {
    id: string,
    username: string,
    avatar?: string,
}
```

Finally, initatlize the Manager and send Raw Data!

```typescript
client.on("ready", async () => {
  await client.lavalink.init({
    id: client.user.id,
    username: client.user.username
  });
});

client.on("raw", data => client.lavalink.sendRawData(data));
```

</details>
