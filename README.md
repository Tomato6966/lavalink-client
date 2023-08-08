# lavalink-client
Easy and advanced lavalink client. Use it with lavalink plugins as well as latest lavalink versions

# Install

Latest stable Version: (currently, unreleased)
```
npm install --save lavalink-client
```
Dev Version: (Current)
```
npm install tomato6966/lavalink-client
```

# Documentation

*soon*

# How to Use

1. Import the Manager

```ts
import { LavalinkManager } from "lavalink-client"; // Modular JS  /  Typescript
```

```js
const { LavalinkManager } = require("lavalink-client"); // Common Js
```

2. create the Manager

```ts
// Suggest it to extend it to the bot Client
client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "youshallnotpass",
            host: "localhost",
            port: 2333,
            id: "testnode",
            requestTimeout: 10000,
        }
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: envConfig.clientId,
        username: "TESTBOT",
        shards: "auto"
    },
    playerOptions: {
        applyVolumeAsFilter: false,
        clientBasedUpdateInterval: 50,
        defaultSearchPlatform: "dzsearch",
        volumeDecrementer: 0.7
    },
    queueOptions: {
        maxPreviousTracks: 5
    }
});
```

3. **VERY IMPORTANT!** - Register Voice State updates + initialize the Manager

```ts
client.on("raw", d => client.lavalink.updateVoiceState(d)); // for voice state updates!
client.on("ready", async () => {
    console.log("Discord Bot is ready to be Used!");
    // user.id is required, user.shards (not), user.username (not, but recommended for lavalink stats!) 
    await client.lavalink.init({ ...client.user!, shards: "auto" }); 
});
```

4. **Use it!**

```ts
// create player
const player = await client.lavalink.createPlayer({
    guildId: guild.id, voiceChannelId: voice.id, textChannelId: text.id, // in what guild + channel(s)
    selfDeaf: true, selfMute: false, volume: 100 // configuration(s)
}); 
// connect the player to it's vc
await player.connect();

const res = await player.search({
    query: `Elton John`, // source: `soundcloud`,
}, client.user); // search a query (query-search, url search, identifier search, etc.)

await player.queue.add(res.tracks); // add 1 track, or an array of tracks
await player.play(); // you can provide specific track, or let the manager choose the track from the queue!
```

## Example (typescript)

Can be found in the [/testBot](https://github.com/Tomato6966/lavalink-client/blob/main/testBot/README.md) Directory