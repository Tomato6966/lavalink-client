import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { GuildMember } from "discord.js";

import type { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pause the player"),
    execute: async (client, interaction) => {
        if (!interaction.guildId) return;

        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if (!vcId)
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                content: "Join a Voice Channel ",
            });

        const player = client.lavalink.getPlayer(interaction.guildId);
        if (!player) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "I'm not connected" });
        if (player.voiceChannelId !== vcId)
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                content: "You need to be in my Voice Channel",
            });

        if (player.paused) return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "Already paused" });

        await player.pause();

        await interaction.reply({
            flags: [MessageFlags.Ephemeral],
            content: `Paused the player`,
        });
    },
} as Command;
