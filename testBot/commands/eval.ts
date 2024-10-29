import { type CommandInteractionOptionResolver, EmbedBuilder, type GuildMember, SlashCommandBuilder } from "discord.js";
import { inspect } from "node:util";

import { SourceLinksRegexes } from "../../src";
import type { Command } from "../types/Client";

export default {
	data: new SlashCommandBuilder()
		.setName("eval")
		.setDescription("Evaluate Code")
		.addStringOption(o => o.setName("code").setDescription("What to execute")),
	execute: async (client, interaction) => {
		if (!interaction.guildId) return;
		if (interaction.user.id !== "498094279793704991")
			return interaction.reply({
				ephemeral: true,
				content: "You are not allowed to do this",
			});

		const vcId = (interaction.member as GuildMember)?.voice?.channelId;
		const player = client.lavalink.getPlayer(interaction.guildId);
		const regexes = SourceLinksRegexes;
		const input = (interaction.options as CommandInteractionOptionResolver).getString("code")!;
		const evaled: unknown = await eval(input);

		player?.connect();

		const string = inspect(evaled).replace(new RegExp(client.token!, "igu"), "✗".repeat(client.token!.length));

		if (string.includes(client.token!))
			return interaction.reply({
				ephemeral: true,
				content: "No token grabbing",
			});

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setAuthor({
						name: `${interaction.user.username}`,
						iconURL: `${interaction.user.avatarURL()}`,
					})
					.setDescription(`### Input \n\`\`\`js\n${input.substring(0, 500)}\n\`\`\`\n## Output\n\`\`\`js\n${string.substring(0, 4096 - input.substring(0, 500).length - 100)}\n\`\`\``),
			],
		});
	},
} as Command;
