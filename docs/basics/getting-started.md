---
description: First steps to get started
---

# Get Started

## Overview

1. [Install the package](getting-started.md#first-you-have-to-install-the-package-into-your-project)
2. [Create the Manager](getting-started.md#then-you-have-to-create-the-manager)
3. [IMPORTANT: Init the Manager & send the Raw-Event](getting-started.md#initialize-the-manager-and-listen-to-the-raw-event)
4. [Search Song(s) and play them](getting-started.md#play-songs)

## First you have to <mark style="color:red;">install the package</mark> into your project

<details>

<summary>👉 via NPM</summary>

```bash
npm install --save lavalink-client
```

Dev Version: (Current)

```bash
npm install tomato6966/lavalink-client
```

</details>

<details>

<summary>👉 via YARN</summary>

```bash
yarn add lavalink-client
```

Dev Version: (Current)

```bash
yarn add tomato6966/lavalink-client
```

</details>

## Then you have to <mark style="color:red;">create the Manager</mark>

{% tabs %}
{% tab title="Typescript / ESM" %}
<pre class="language-typescript" data-title="index.ts" data-line-numbers><code class="lang-typescript"><strong>import { LavalinkManager } from "lavalink-client";
</strong><strong>import { Client, GatewayIntentBits } from "discord.js";
</strong><strong>
</strong><strong>// create bot client
</strong><strong>const client = new Client({
</strong>    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
}) as Client &#x26; { lavalink: LavalinkManager }; 
<strong>
</strong><strong>// create lavalink client
</strong>client.lavalink = new LavalinkManager({
    nodes: [
        { // Important to have at least 1 node
            authorization: "yourverystrongpassword",
            host: "localhost",
            port: 2333,
            id: "testnode"
        }
    ],
    sendToShard: (guildId, payload) =>
        client.guilds.cache.get(guildId)?.shard?.send(payload),
    client: {
        id: process.env.CLIENT_ID, username: "TESTBOT",
    },
    // everything down below is optional
    autoSkip: true,
    playerOptions: {
        clientBasedPositionUpdateInterval: 150,
        defaultSearchPlatform: "ytmsearch",
        volumeDecrementer: 0.75,
        //requesterTransformer: requesterTransformer,
        onDisconnect: {
            autoReconnect: true, 
            destroyPlayer: false 
        },
        onEmptyQueue: {
            destroyAfterMs: 30_000, 
            //autoPlayFunction: autoPlayFunction,
        }
    },
    queueOptions: {
        maxPreviousTracks: 25
    },
});
</code></pre>
{% endtab %}

{% tab title="JavaScript (cjs)" %}
{% code title="index.js" lineNumbers="true" %}
```javascript
const { LavalinkManager } = require("lavalink-client");
const { Client, GatewayIntentBits } = require("discord.js");

// create bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// create lavalink client
client.lavalink = new LavalinkManager({
    nodes: [
        { // Important to have at least 1 node
            authorization: "yourverystrongpassword",
            host: "localhost",
            port: 2333,
            id: "testnode"
        }
    ],
    sendToShard: (guildId, payload) =>
        client.guilds.cache.get(guildId)?.shard?.send(payload),
    client: {
        id: process.env.CLIENT_ID, username: "TESTBOT",
    },
    // everything down below is optional
    autoSkip: true,
    playerOptions: {
        clientBasedPositionUpdateInterval: 150,
        defaultSearchPlatform: "ytmsearch",
        volumeDecrementer: 0.75,
        //requesterTransformer: requesterTransformer,
        onDisconnect: {
            autoReconnect: true, 
            destroyPlayer: false 
        },
        onEmptyQueue: {
            destroyAfterMs: 30_000, 
            //autoPlayFunction: autoPlayFunction,
        }
    },
    queueOptions: {
        maxPreviousTracks: 25
    },
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

## Initialize the Manager and listen to the <mark style="color:red;">raw Event</mark>

{% tabs %}
{% tab title="Typescript / ESM" %}
<pre class="language-typescript" data-title="index.ts" data-line-numbers><code class="lang-typescript"><strong>// above the lavalinkManager + client were created
</strong><strong>client.on("raw", d => client.lavalink.sendRawData(d));
</strong>client.on("ready", async () => {
    console.log("Discord Bot is ready to be Used!");
    await client.lavalink.init({ ...client.user! }); 
});
</code></pre>
{% endtab %}

{% tab title="JavaScript (cjs)" %}
{% code title="index.js" lineNumbers="true" %}
```javascript
// above the lavalinkManager + client were created
client.on("raw", d => client.lavalink.sendRawData(d));
client.on("ready", async () => {
    console.log("Discord Bot is ready to be Used!");
    await client.lavalink.init({ ...client.user! }); 
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

## Play Songs

{% tabs %}
{% tab title="Typescript / ESM" %}
{% code title="index.ts" lineNumbers="true" %}
```typescript
// create player
const player = await client.lavalink.createPlayer({
    guildId: guild.id, 
    voiceChannelId: voice.id, 
    textChannelId: text.id, 
    // optional configurations:
    selfDeaf: true, 
    selfMute: false, 
    volume: 100
}); 

// connect the player to it's vc
await player.connect();

// search a query (query-search, url search, identifier search, etc.)
const res = await player.search({
    query: `Elton John`, // source: `soundcloud`,
}, interaction.user); 

// add the first result
await player.queue.add(res.tracks[0]); 

// only play if the player isn't playing something, 
if(!player.playing) await player.play(); // you can provide specific track, or let the manager choose the track from the queue!
```
{% endcode %}
{% endtab %}

{% tab title="JavaScript (cjs)" %}
{% code title="index.js" lineNumbers="true" %}
```javascript
// create player
const player = await client.lavalink.createPlayer({
    guildId: guild.id, 
    voiceChannelId: voice.id, 
    textChannelId: text.id, 
    // optional configurations:
    selfDeaf: true, 
    selfMute: false, 
    volume: 100
}); 

// connect the player to it's vc
await player.connect();

// search a query (query-search, url search, identifier search, etc.)
const res = await player.search({
    query: `Elton John`, // source: `soundcloud`,
}, interaction.user); 

// add the first result
await player.queue.add(res.tracks[0]); 

// only play if the player isn't playing something, 
if(!player.playing) await player.play(); // you can provide specific track, or let the manager choose the track from the queue!
```
{% endcode %}
{% endtab %}
{% endtabs %}

## How to add more features?

If you wanna display things like "started playing a track", "queue ended", check out all possible Events!

Important! Before creating a player, make sure that at least 1 node is connected to the lavalink node
