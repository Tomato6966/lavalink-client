/* eslint-disable */
import { inspect } from "util";

import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { CommandInteractionOptionResolver, GuildMember } from "discord.js";
import { SourceLinksRegexes } from "lavalink-client";

import type { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Evaluate Code")
        .addStringOption((o) => o.setName("code").setDescription("What to execute")),
    execute: async (client, interaction) => {
        if (!interaction.guildId) return;
        if (interaction.user.id !== "498094279793704991")
            return interaction.reply({
                flags: [MessageFlags.Ephemeral],
                content: "You are not allowed to do this",
            });

        // you can declare "unused variables and still use them within the evaluation scope"

        // #region eval-scope
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = client.lavalink.getPlayer(interaction.guildId);
        const regexes = SourceLinksRegexes;
        // #end-region eval-scope

        let evaled;
        const input = (interaction.options as CommandInteractionOptionResolver).getString("code")!;
        evaled = await eval(input);

        player?.connect();

        let string = inspect(evaled).replace(new RegExp(client.token!, "igu"), "✗".repeat(client.token!.length));

        if (string.includes(client.token!))
            return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "No token grabbing" });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `${interaction.user.username}`,
                        iconURL: `${interaction.user.avatarURL()}`,
                    })
                    .setDescription(
                        `### Input \n\`\`\`js\n${input.substring(0, 500)}\n\`\`\`\n## Output\n\`\`\`js\n${string.substring(0, 4096 - input.substring(0, 500).length - 100)}\n\`\`\``,
                    ),
            ],
        });
    },
} as Command;
