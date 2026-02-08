import { TextChannel } from "discord.js";

import type { BotClient } from "../types/Client";

import type { PlayerSaver } from "./CustomClasses";

export async function handleResuming(client: BotClient, playerSaver: PlayerSaver) {
    client.lavalink.nodeManager
        .on("connect", (node) => {
            node.updateSession(true, 360e3); // enable resuming for playback of up to 360s
        })
        .on("resumed", async (node, payload, players) => {
            if (!Array.isArray(players)) return console.error("Players is not an array", players);
            for (const data of players) {
                const dataOfSaving = await playerSaver.getPlayer(data.guildId);
                if (!dataOfSaving) {
                    console.error("player is not saved!");
                    continue;
                }
                console.log("resuming player:", data.guildId);
                if (!data.state.connected) {
                    console.log("skipping resuming player, because it already disconnected");
                    // lavalink already disconnected the player, now you have 2 options:
                    // - stay disconnected or reconnect and re-play the saved queue
                    // i prefer disconnection, cause that means it's the resuming delay got "outreached"
                    await playerSaver.delPlayer(data.guildId);
                    continue;
                }

                const player = client.lavalink.createPlayer({
                    guildId: data.guildId,
                    voiceChannelId: dataOfSaving.voiceChannelId,
                    textChannelId: dataOfSaving.textChannelId,
                    selfDeaf: dataOfSaving.options?.selfDeaf || true,
                    selfMute: dataOfSaving.options?.selfMute || false,
                    // you need to update the volume of the player by the volume of lavalink which might got decremented by the volume decrementer
                    volume: client.lavalink.options.playerOptions?.volumeDecrementer
                        ? Math.round(data.volume / client.lavalink.options.playerOptions.volumeDecrementer)
                        : data.volume,
                    node: node.id,
                    applyVolumeAsFilter: dataOfSaving.options.applyVolumeAsFilter,
                    instaUpdateFiltersFix: dataOfSaving.options.instaUpdateFiltersFix,
                    vcRegion: dataOfSaving.options.vcRegion,
                });
                // override the player voice server data
                // player.voice = data.voice;
                // normally just player.voice is enough, but if you restart the entire bot, you need to create a new connection, thus call player.connect();
                await player.connect();
                // override the filters data
                player.filterManager.data = data.filters;
                // get the queue data including the current track (for the requester)
                await player.queue.utils.sync(true, false).catch(console.warn);
                // override the current track with the data from lavalink
                if (data.track)
                    player.queue.current = client.lavalink.utils.buildTrack(
                        data.track,
                        player.queue.current?.requester || client.user,
                    );
                // override the position of the player
                player.lastPosition = data.state.position;
                player.lastPositionChange = Date.now();
                player.ping.lavalink = data.state.ping;
                // important to have skipping work correctly later
                player.paused = data.paused;
                player.playing = !data.paused && !!data.track;
                console.log("finished resuming the player");
                // optional send info for example
                if (player.textChannelId) {
                    const channel = client.channels.cache.get(player.textChannelId) as TextChannel;
                    if (channel) {
                        channel.send("Player resumed ;) you can now control it again!");
                    }
                }
            }
        });

    // delete the player on destroy
    client.lavalink.on("playerDestroy", (player) => {
        playerSaver.delPlayer(player.guildId);
    });
    // listen to events
    playerSaver.listenToEvents(client.lavalink);
}
