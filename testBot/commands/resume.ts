import { type GuildMember, SlashCommandBuilder } from "discord.js";

import type { Command } from "../types/Client";

export default {
	data: new SlashCommandBuilder().setName("resume").setDescription("Resume the player"),
	execute: async (client, interaction) => {
		if (!interaction.guildId) return;
		const vcId = (interaction.member as GuildMember)?.voice?.channelId;
		const player = client.lavalink.getPlayer(interaction.guildId);
		if (!player)
			return interaction.reply({
				ephemeral: true,
				content: "I'm not connected",
			});
		if (!vcId)
			return interaction.reply({
				ephemeral: true,
				content: "Join a Voice Channel ",
			});
		if (player.voiceChannelId !== vcId)
			return interaction.reply({
				ephemeral: true,
				content: "You need to be in my Voice Channel",
			});
		if (!player.paused) return interaction.reply({ ephemeral: true, content: "Not paused" });

		await player.resume();

		await interaction.reply({
			ephemeral: true,
			content: "Resumed the player",
		});
	},
} as Command;
