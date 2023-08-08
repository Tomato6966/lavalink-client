import { BotClient } from "../types/Client";

export function PlayerEvents(client:BotClient) {
    /**
     * PLAYER EVENTS
     */
    client.lavalink.on("playerCreate", (player) => {
        console.log(player.guildId, " :: Created a Player :: ");
    }).on("playerDestroy", (player) => {
        console.log(player.guildId, " :: Player got Destroyed :: ");
    }).on("playerDisconnect", (player, voiceChannelId) => {
        console.log(player.guildId, " :: Player disconnected the Voice Channel :: ", voiceChannelId);
    }).on("playerMove", (player, oldVoiceChannelId, newVoiceChannelId) => {
        console.log(player.guildId, " :: Player moved from Voice Channel :: ", oldVoiceChannelId, " :: To ::", newVoiceChannelId);
    }).on("playerSocketClosed", (player, payload) => {
        console.log(player.guildId, " :: Player socket got closed from lavalink :: ", payload);
    })
    /**
     * Queue/Track Events
     */
    client.lavalink.on("trackStart", (player, track) => {
        console.log(player.guildId, " :: Started Playing :: ", track.info.title)
    }).on("trackEnd", (player, track, payload) => {
        console.log(player.guildId, " :: Finished Playing :: ", track.info.title)
    }).on("trackError", (player, track, payload) => {
        console.log(player.guildId, " :: Errored while Playing :: ", track.info.title, " :: ERROR DATA :: ", payload)
    }).on("trackStuck", (player, track, payload) => {
        console.log(player.guildId, " :: Got Stuck while Playing :: ", track.info.title, " :: STUCKED DATA :: ", payload)
    }).on("queueEnd", (player, track, payload) => {
        console.log(player.guildId, " :: No more tracks in the queue, after playing :: ", track.info.title)
    });
}