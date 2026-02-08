import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { CommandInteractionOptionResolver, GuildMember } from "discord.js";

import type { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Set the Repeat Mode")
        .addStringOption((o) =>
            o
                .setName("repeatmode")
                .setDescription("What do you want to do?")
                .setRequired(true)
                .setChoices(
                    { name: "Off", value: "off" },
                    { name: "Track", value: "track" },
                    { name: "Queue", value: "queue" },
                ),
        ),
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

        if (!player.queue.current)
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                content: "I'm not playing anything",
            });

        await player.setRepeatMode(
            (interaction.options as CommandInteractionOptionResolver).getString("repeatmode") as
                | "off"
                | "track"
                | "queue",
        );

        await interaction.reply({
            flags: [MessageFlags.Ephemeral],
            content: `Set repeat mode to ${player.repeatMode}`,
        });
    },
} as Command;
