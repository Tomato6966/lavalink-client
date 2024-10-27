import { type GuildMember, SlashCommandBuilder } from "discord.js";

import type { Command } from "../types/Client";

export default {
	data: new SlashCommandBuilder().setName("resume_with_fix").setDescription("Resume the player with the playback fix"),
	execute: async (client, interaction) => {
		if (!interaction.guildId) return;
		const vcId = (interaction.member as GuildMember)?.voice?.channelId;
		const player = client.lavalink.getPlayer(interaction.guildId);
		if (!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
		if (!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel " });
		if (player.voiceChannelId !== vcId)
			return interaction.reply({
				ephemeral: true,
				content: "You need to be in my Voice Channel",
			});
		if (!player.paused) return interaction.reply({ ephemeral: true, content: "Not paused" });

		if (!player.queue.current) {
			await player.resume();
			await interaction.reply({
				ephemeral: true,
				content: "Resumed the player (without fix because tehre is no current)",
			});
			return;
		}

		// to fix the "song get's skipped on unpause", we need to re-play the current song but on the same position to create a new playback stream
		// the issue happens wshen you pause for a too long duration
		// you can add handlings, like if pause-duration < 30s return player.resume();
		// to get pause duration you can intruduce a custom variavble like player.set("custom_pause_timestamp", Date.now()) -> player.get("custom_pause_timestamp")
		return await player.play({
			track: {
				encoded: player.queue.current.encoded,
				requester: player.queue.current.requester,
				userData: {
					...(player.queue.current.userData || {}), // pass previous userData or empty object
					resumeSkipFix: "true",
				},
			},
			paused: false,
			position: player.lastPosition,
			noReplace: false,
		});
	},
} as Command;
