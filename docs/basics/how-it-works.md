# How it works

## Graphical Display

<img src="../.gitbook/assets/file.excalidraw.svg" alt="How a Lavalink Client works (roughly)" class="gitbook-drawing">

1. First you have to create a manager:

```javascript
const manager = new LavalinkManager({ nodes: [...], sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload), });
```

TIPP: I'd recommend to assing the manager to the client, like: `client.manager = new Lava...`

2. Create a player:&#x20;

```javascript
const player = manager.createPlayer({ guildId: "...", voiceChannelId: "..." });
```

3. &#x20;Connect the player&#x20;

```javascript
await player.connect();
```

4. Search with the player:

```javascript
const result = await player.search({ query: "Adele Hello", source: "youtube" }, interaction.user);
```

5. Add the search result tracks / first result track (single) to the queue:

```javascript
await player.queue.add(result.tracks[0]);
```

6. In order to play the next song of the queue:

```javascript
await player.play();
```

> if you are playing a song, and want to play the next song, you have to run:
>
> ```javascript
> await player.skip();
> ```

If you want to leave channel, run `player.disconnect()`, you can then change voice channel and run `player.connect()` again.

If you want to stop playing and re-create the player, run:

```javascript
await player.destroy();
```

To get the Player after it was created somewhere else, use:

```javascript
const player = manager.getPlayer(guildId)
```

7. Wanna know if a track Starts to play / ends playing, queue ends. etc. etc. Then listen to events!

```javascript
manager.on("trackStart", (player, track) => {
 client.channels.cache.get(player.textChannelId).send(`Started playing ${track.info.title}`})
});
manager.on("queueEnd", (player) => { 
 client.channels.cache.get(player.textChannelId).send(`Nothing left to play`})
}); 
```

For more information, also such as automated options for manager / players, check out the [Documentation Page](../docs.md)
