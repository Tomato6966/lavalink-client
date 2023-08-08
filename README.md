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
client.musicManager = new LavalinkManager({
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
client.on("raw", d => client.musicManager.updateVoiceState(d)); // for voice state updates!
client.on("ready", async () => {
    console.log("Discord Bot is ready to be Used!");
    // user.id is required, user.shards (not), user.username (not, but recommended for lavalink stats!) 
    await client.musicManager.init({ ...client.user!, shards: "auto" }); 
});
```

4. **Use it!**

```ts
// create player
const player = await client.musicManager.playerManager.createPlayer({
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

```ts
import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { LavalinkManager } from "lavalink-client";

config();
const envConfig = {
    token: process.env.DISCORD_TOKEN as string,
    clientId: process.env.CLIENTID as string,
    voiceChannelId: "1070626568260562958", textChannelId: "1070645885236695090"
}
async function LavalinkClientEvents() {
    /**
     * NODE EVENTS
     */
    client.musicManager.nodeManager.on("raw", (node, payload) => {
        //console.log(node.id, " :: RAW :: ", payload);
    }).on("disconnect", (node, reason) => {
        console.log(node.id, " :: DISCONNECT :: ", reason);
    }).on("connect", (node) => {
        console.log(node.id, " :: CONNECTED :: ");
        testPlay(); // TEST THE MUSIC ONCE CONNECTED TO THE BOT
    }).on("reconnecting", (node) => {
        console.log(node.id, " :: RECONNECTING :: ");
    }).on("create", (node) => {
        console.log(node.id, " :: CREATED :: ");
    }).on("destroy", (node) => {
        console.log(node.id, " :: DESTROYED :: ");
    }).on("error", (node, error, payload) => {
        console.log(node.id, " :: ERRORED :: ", error, " :: PAYLOAD :: ", payload);
    });

    /**
     * PLAYER EVENTS
     */
    client.musicManager.playerManager.on("trackStart", (player, track) => {
        console.log(player.guildId, " :: Started Playing :: ", track.info.title)
    });
}

async function testPlay() {
    await delay(150); // SHORT DELAY
    if(!client.musicManager.useable) return console.log("NOT USEABLE ATM!");
    const testGuild = client.guilds.cache.get("1070626568260562954")!;

    const player = await client.musicManager.playerManager.createPlayer({
        guildId: testGuild.id, voiceChannelId: envConfig.voiceChannelId, textChannelId: envConfig.textChannelId, // in what guild + channel(s)
        selfDeaf: true, selfMute: false, volume: 100 // configuration(s)
    });
    await player.connect();
    const res = await player.search({
        query: `Elton John`,
    }, client.user);
    await player.queue.add(res.tracks);
    await player.play({
        endTime: 30000,
        position: 25000,
    });
}


const delay = async (ms) => new Promise(r => setTimeout(() => r(true), ms));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
}) as Client & { musicManager: LavalinkManager };

client.musicManager = new LavalinkManager({
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
// register the lavalink Client Event(s)
LavalinkClientEvents(); 

client.on("raw", d => { 
    // VERY IMPORTANT!
    client.musicManager.updateVoiceState(d); 
})
client.on("ready", async () => {
    console.log("Discord Bot is ready to be Used!");
    //VERY IMPORTANT!
    await client.musicManager.init({ ...client.user!, shards: "auto" }); 
});

client.login(process.env.DISCORD_TOKEN);
```