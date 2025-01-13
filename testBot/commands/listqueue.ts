import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import type { GuildMember } from "discord.js";
import type { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("listqueue").setDescription("List the queue"),
    execute: async (client, interaction) => {
        if (!interaction.guildId) return;

        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if (!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel " });

        const player = client.lavalink.getPlayer(interaction.guildId);
        if (!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        if (player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" })

        const current = player.queue.current;
        const nextTrack = player.queue.tracks[0];

        if (!nextTrack) return interaction.reply({ ephemeral: true, content: `No Tracks to list` });


        await interaction.reply({
            ephemeral: true, embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`Queue of ${interaction.guild?.name}: ${player.queue.tracks.length} Tracks`)
                    .setDescription([
                        `## Current:`,
                        `> ### [\`${current?.info.title}\`](${current?.info.uri})`,
                        `## Next ${player.queue.tracks.length > 20 ? 20 : player.queue.tracks.length} Tracks:`,
                        player.queue.tracks.slice(0, 20)
                            .map((t, i) => `> **${i + 1}.** [\`${t.info.title}\`](${t.info.uri})`).join("\n")
                    ].join("\n"))
            ]
        });
    }
} as Command;
