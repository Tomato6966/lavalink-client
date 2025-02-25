import { SlashCommandBuilder } from "discord.js";

import type { GuildMember } from "discord.js";
import type { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("stop").setDescription("Stops the player & leaves the voice"),
    execute: async (client, interaction) => {
        if (!interaction.guildId) return;

        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if (!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel " });

        const player = client.lavalink.getPlayer(interaction.guildId);
        if (!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        if (player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" })

        await player.destroy(`${interaction.user.username} stopped the Player`);

        await interaction.reply({ content: "Stopped the player" });
    }
} as Command;
