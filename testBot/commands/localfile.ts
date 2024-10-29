import { type CommandInteractionOptionResolver, type GuildMember, SlashCommandBuilder, type VoiceChannel } from "discord.js";

import type { Command } from "../types/Client";

export default {
	data: new SlashCommandBuilder()
		.setName("localfile")
		.setDescription("Play a local file")
		.addStringOption(o => o.setName("filepath").setDescription("Must be the path of the file on the server where lavalink is running").setRequired(true)),
	execute: async (client, interaction) => {
		if (!interaction.guildId) return;

		const vcId = (interaction.member as GuildMember)?.voice?.channelId;
		if (!vcId)
			return interaction.reply({
				ephemeral: true,
				content: "Join a Voice Channel ",
			});

		const vc = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;
		if (!vc.joinable || !vc.speakable)
			return interaction.reply({
				ephemeral: true,
				content: "I am not able to join your channel / speak in there.",
			});

		const player = await client.lavalink.createPlayer({
			guildId: interaction.guildId,
			voiceChannelId: vcId,
			textChannelId: interaction.channelId,
			selfDeaf: true,
			selfMute: false,
			volume: 100, // default volume
			instaUpdateFiltersFix: true, // optional
			applyVolumeAsFilter: false, // if true player.setVolume(54) -> player.filters.setVolume(0.54)
			// node: "YOUR_NODE_ID",
			// vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
		});
		const connected = player.connected;

		if (!connected) await player.connect();
		if (player.voiceChannelId !== vcId)
			return interaction.reply({
				ephemeral: true,
				content: "You need to be in my Voice Channel",
			});

		const filepath = (interaction.options as CommandInteractionOptionResolver).getString("filepath")!;

		const response = await player.search({ query: filepath, source: "local" }, interaction.user);

		if (!response || !response.tracks?.length) return interaction.reply({ content: "No Tracks found", ephemeral: true });

		player.queue.add(response.tracks[0]);

		await interaction.reply({
			content: `Added your Local File request to queue position. #${player.queue.tracks.length}`,
			ephemeral: true,
		});

		if (!player.playing) await player.play(connected ? { volume: client.defaultVolume, paused: false } : undefined);
	},
} as Command;
