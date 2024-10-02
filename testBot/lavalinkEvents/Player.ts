import { EmbedBuilder, Message, MessageCreateOptions, TextChannel, VoiceChannel } from "discord.js";

import { DebugEvents, Player } from "../../src";
import { BotClient, CustomRequester } from "../types/Client";
import { delay, formatMS_HHMMSS } from "../Utils/Time";

const messagesMap = new Map<string, Message>();

export function PlayerEvents(client:BotClient) {
    /**
     * PLAYER EVENTS
     */
    client.lavalink.on("playerCreate", (player) => {
        logPlayer(client, player, "Created a Player :: ");
    })
    .on("playerDestroy", (player, reason) => {
        logPlayer(client, player, "Player got Destroyed :: ");
        sendPlayerMessage(client, player, {
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setTitle("❌ Player Destroyed")
                .setDescription(`Reason: ${reason || "Unknown"}`)
                .setTimestamp()
            ]
        });
    })
    .on("playerDisconnect", (player, voiceChannelId) => {
        logPlayer(client, player, "Player disconnected the Voice Channel :: ", voiceChannelId);
    })
    .on("playerMove", (player, oldVoiceChannelId, newVoiceChannelId) => {
        logPlayer(client, player, "Player moved from Voice Channel :: ", oldVoiceChannelId, " :: To ::", newVoiceChannelId);
    })
    .on("playerSocketClosed", (player, payload) => {
        logPlayer(client, player, "Player socket got closed from lavalink :: ", payload);
    })
    .on("playerUpdate", (player) => {
        // use this event to udpate the player in the your cache if you want to save the player's data(s) externally!
        /**
         *
        */
    })
    .on("playerMuteChange", (player, selfMuted, serverMuted) => {
        logPlayer(client, player, "INFO: playerMuteChange", { selfMuted, serverMuted });
        // e.g. what you could do is when the bot get's server muted, you could pause the player, and unpause it when unmuted again
        if(serverMuted) {
            player.set("paused_of_servermute", true);
            player.pause();
        } else {
            if(player.get("paused_of_servermute") && player.paused) player.resume();
        }
        // e.g. "unmute the player again"
        // if(serverMuted === true)  client.guilds.cache.get(player.guildId)?.members.me?.voice.setMute(false, "Auto unmute the player");
    })
    .on("playerDeafChange", (player, selfDeaf, serverDeaf) => {
        logPlayer(client, player, "INFO: playerDeafChange");
        // e.g. "re-deaf the player" because ppl think this way the bot saves traffic
        // if(serverDeaf === false) client.guilds.cache.get(player.guildId)?.members.me?.voice.setDeaf(true, "Auto re-deaf the player");
    })
    .on("playerSuppressChange", (player, suppress) => {
        logPlayer(client, player, "INFO: playerSuppressChange");
        // e.g. you could automatically unsuppress the bot so he's allowed to speak
    })
    .on("playerQueueEmptyStart", async (player, delayMs) => {
        logPlayer(client, player, "INFO: playerQueueEmptyStart");
        const msg = await sendPlayerMessage(client, player, {
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Player queue got empty, will disconnect <t:${Math.round((Date.now() + delayMs) / 1000)}:R>`)
            ]
        });
        if(msg) messagesMap.set(`${player.guildId}_queueempty`, msg);
    })
    .on("playerQueueEmptyEnd", (player) => {
        logPlayer(client, player, "INFO: playerQueueEmptyEnd");
        // you can e.g. edit the saved message
        const msg = messagesMap.get(`${player.guildId}_queueempty`);
        if(msg?.editable) {
            msg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Player got destroyed because of queue Empty`)
                ]
            })
        }
    })
    .on("playerQueueEmptyCancel", (player) => {
        logPlayer(client, player, "INFO: playerQueueEmptyEnd");
        // you can e.g. edit the saved message
        const msg = messagesMap.get(`${player.guildId}_queueempty`);
        if(msg?.editable) {
            msg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Player queue empty timer got cancelled. Because i got enqueued a new track`)
                ]
            })
        }
    })
    .on("playerVoiceLeave", (player, userId) => {
        logPlayer(client, player, "INFO: playerVoiceLeave: ", userId);
    })
    .on("playerVoiceJoin", (player, userId) => {
        logPlayer(client, player, "INFO: playerVoiceJoin: ", userId);
    })
    .on("debug", (eventKey, eventData) => {
        // skip specific log
        if(eventKey === DebugEvents.NoAudioDebug && eventData.message === "Manager is not initated yet") return;
        // skip specific event log of a log-level-state "log"
        if(eventKey === DebugEvents.PlayerUpdateSuccess && eventData.state === "log") return;
        return;
        console.group("Lavalink-Client-Debug:");
        console.log("-".repeat(20));
        console.debug(`[${eventKey}]`);
        console.debug(eventData)
        console.log("-".repeat(20));
        console.groupEnd();
    });;

    /**
     * Queue/Track Events
     */
    client.lavalink.on("trackStart", (player, track) => {
        const avatarURL = (track?.requester as CustomRequester)?.avatar || undefined;

        logPlayer(client, player, "Started Playing :: ", track?.info?.title, "QUEUE:", player.queue.tracks.map(v => v.info.title));

        const embeds = [
            new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`🎶 ${track?.info?.title}`.substring(0, 256))
            .setThumbnail(track?.info?.artworkUrl || track?.pluginInfo?.artworkUrl || null)
            .setDescription(
                [
                    `> - **Author:** ${track?.info?.author}`,
                    `> - **Duration:** ${formatMS_HHMMSS(track?.info?.duration || 0)} | Ends <t:${Math.floor((Date.now() + (track?.info?.duration || 0)) / 1000)}:R>`,
                    `> - **Source:** ${track?.info?.sourceName}`,
                    `> - **Requester:** <@${(track?.requester as CustomRequester)?.id}>`,
                    track?.pluginInfo?.clientData?.fromAutoplay ? `> *From Autoplay* ✅` : undefined
                ].filter(v => typeof v === "string" && v.length).join("\n").substring(0, 4096)
            )
            .setFooter({
                text: `Requested by ${(track?.requester as CustomRequester)?.username}`,
                iconURL: /^https?:\/\//.test(avatarURL || "") ? avatarURL : undefined,
            })
            .setTimestamp()
        ];
        // some tracks might have a "uri" which is not a valid http url (e.g. spotify local, files, etc.)
        if(track?.info?.uri && /^https?:\/\//.test(track?.info?.uri)) embeds[0].setURL(track.info.uri)

        sendPlayerMessage(client, player, { embeds });
    })
    .on("trackEnd", (player, track, payload) => {
        logPlayer(client, player, "Finished Playing :: ", track?.info?.title)
    })
    .on("trackError", (player, track, payload) => {
        logPlayer(client, player, "Errored while Playing :: ", track?.info?.title, " :: ERROR DATA :: ", payload)
    })
    .on("trackStuck", (player, track, payload) => {
        logPlayer(client, player, "Got Stuck while Playing :: ", track?.info?.title, " :: STUCKED DATA :: ", payload)
    })
    .on("queueEnd", (player, track, payload) => {
        logPlayer(client, player, "No more tracks in the queue, after playing :: ", track?.info?.title || track)
        sendPlayerMessage(client, player, {
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setTitle("❌ Queue Ended")
                .setTimestamp()
            ]
        });
    })

}

// structured - grouped logging
function logPlayer(client:BotClient, player:Player, ...messages) {
    console.group("Player Event");
        console.log(`| Guild: ${player.guildId} | ${client.guilds.cache.get(player.guildId)?.name}`);
        console.log(`| Voice Channel: #${(client.channels.cache.get(player.voiceChannelId!) as VoiceChannel)?.name || player.voiceChannelId}`);
        console.group("| Info:")
            console.log(...messages);
        console.groupEnd();
    console.groupEnd();
    return;
}

async function sendPlayerMessage(client:BotClient, player:Player, messageData:MessageCreateOptions) {
    const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
    if(!channel) return;

    return channel.send(messageData);
}
