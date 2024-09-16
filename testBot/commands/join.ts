import { type GuildMember, SlashCommandBuilder, type VoiceChannel } from "discord.js";

import type { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder().setName("join").setDescription("Joins a Voice Channel"),
    execute: async (client, interaction) => {
        if (!interaction.guildId) return;

        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if (!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel " });

        const vc = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;
        if (!vc.joinable || !vc.speakable)
            return interaction.reply({ ephemeral: true, content: "I am not able to join your channel / speak in there." });

        const player = client.lavalink.getPlayer(interaction.guildId);
        if (player?.voiceChannelId && player.connected) return interaction.reply({ ephemeral: true, content: "I'm already connected." });
        if (player) {
            // player already created, but not connected yet -> connect to it!
            player.voiceChannelId = player?.voiceChannelId || vcId;
            await player.connect();
        }
        const newPlayer = await client.lavalink.createPlayer({
            guildId: interaction.guildId,
            voiceChannelId: vcId,
            textChannelId: interaction.channelId,
            selfDeaf: true,
            selfMute: false,
            volume: client.defaultVolume, // default volume
            instaUpdateFiltersFix: true, // optional
            applyVolumeAsFilter: false, // if true player.setVolume(54) -> player.filters.setVolume(0.54)
            // node: "YOUR_NODE_ID",
            // vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
        });
        await newPlayer.connect();
        await interaction.reply({
            content: `Joined your Voice Channel`,
            ephemeral: true,
        });
    },
} as Command;
