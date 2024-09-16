import { EmbedBuilder, type TextChannel } from "discord.js";

import { DebugEvents } from "../../src";
import type { BotClient, CustomRequester } from "../types/Client";
import { formatMS_HHMMSS } from "../Utils/Time";

export function PlayerEvents(client: BotClient) {
    /**
     * PLAYER EVENTS
     */
    client.lavalink
        .on("playerCreate", (player) => {
            console.log(player.guildId, " :: Created a Player :: ");
        })
        .on("playerDestroy", (player, reason) => {
            console.log(player.guildId, " :: Player got Destroyed :: ");
            const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
            if (!channel) return console.log("No Channel?", player);
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Player Destroyed")
                        .setDescription(`Reason: ${reason || "Unknown"}`)
                        .setTimestamp(),
                ],
            });
        })
        .on("playerDisconnect", (player, voiceChannelId) => {
            console.log(player.guildId, " :: Player disconnected the Voice Channel :: ", voiceChannelId);
        })
        .on("playerMove", (player, oldVoiceChannelId, newVoiceChannelId) => {
            console.log(player.guildId, " :: Player moved from Voice Channel :: ", oldVoiceChannelId, " :: To ::", newVoiceChannelId);
        })
        .on("playerSocketClosed", (player, payload) => {
            console.log(player.guildId, " :: Player socket got closed from lavalink :: ", payload);
        })
        .on("debug", (eventKey, eventData) => {
            // skip specific log
            if (eventKey === DebugEvents.NoAudioDebug && eventData.message === "Manager is not initated yet") return;
            // skip specific event log of a log-level-state "log"
            if (eventKey === DebugEvents.PlayerUpdateSuccess && eventData.state === "log") return;

            console.group("Lavalink-Client-Debug:");
            console.log("-".repeat(20));
            console.debug(`[${eventKey}]`);
            console.debug(eventData);
            console.log("-".repeat(20));
            console.groupEnd();
        });

    /**
     * Queue/Track Events
     */
    client.lavalink
        .on("trackStart", (player, track) => {
            if (!track && player.queue.current) track = player.queue.current;

            const avatarURL = (track?.requester as CustomRequester)?.avatar || undefined;

            console.log(
                player.guildId,
                " :: Started Playing :: ",
                track?.info?.title,
                "QUEUE:",
                player.queue.tracks.map((v) => v.info.title),
            );
            const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
            if (!channel) return;
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`🎶 ${track?.info?.title}`.substring(0, 256))
                .setThumbnail(track?.info?.artworkUrl || track?.pluginInfo?.artworkUrl || null)
                .setDescription(
                    [
                        `> - **Author:** ${track?.info?.author}`,
                        `> - **Duration:** ${formatMS_HHMMSS(track?.info?.duration || 0)} | Ends <t:${Math.floor((Date.now() + (track?.info?.duration || 0)) / 1000)}:R>`,
                        `> - **Source:** ${track?.info?.sourceName}`,
                        `> - **Requester:** <@${(track?.requester as CustomRequester)?.id}>`,
                        track?.pluginInfo?.clientData?.fromAutoplay ? `> *From Autoplay* ✅` : undefined,
                    ]
                        .filter((v) => typeof v === "string" && v.length)
                        .join("\n")
                        .substring(0, 4096),
                )
                .setFooter({
                    text: `Requested by ${(track?.requester as CustomRequester)?.username}`,
                    iconURL: /^https?:\/\//.test(avatarURL || "") ? avatarURL : undefined,
                })
                .setTimestamp();
            // local tracks are invalid uris
            if (track?.info?.uri && /^https?:\/\//.test(track?.info?.uri)) embed.setURL(track.info.uri);
            channel.send({
                embeds: [embed],
            });
        })
        .on("trackEnd", (player, track, payload) => {
            console.log(player.guildId, " :: Finished Playing :: ", track?.info?.title);
        })
        .on("trackError", (player, track, payload) => {
            console.log(player.guildId, " :: Errored while Playing :: ", track?.info?.title, " :: ERROR DATA :: ", payload);
        })
        .on("trackStuck", (player, track, payload) => {
            console.log(player.guildId, " :: Got Stuck while Playing :: ", track?.info?.title, " :: STUCKED DATA :: ", payload);
        })
        .on("queueEnd", (player, track, payload) => {
            console.log(player.guildId, " :: No more tracks in the queue, after playing :: ", track?.info?.title || track);
            const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
            if (!channel) return;
            channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setTitle("❌ Queue Ended").setTimestamp()],
            });
        })
        .on("playerUpdate", (player) => {
            // use this event to udpate the player in the your cache if you want to save the player's data(s) externally!
            /**
             *
             */
        });
}
