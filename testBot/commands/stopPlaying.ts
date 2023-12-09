import { GuildMember, SlashCommandBuilder } from "discord.js";

import { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("stopplaying").setDescription("Stops the player without leaving")
        .addBooleanOption(o => o.setName("clear_queue").setDescription("Should the queue be cleared? (default true)").setRequired(false))
        .addBooleanOption(o => o.setName("execute_autoplay").setDescription("Should autoplay function be executed? (default false)").setRequired(false)),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = client.lavalink.getPlayer(interaction.guildId);
        if(!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        
        // example to apply a filter!
        await player.stopPlaying(interaction.options?.getBoolean?.("clear_queue") ?? true, interaction.options?.getBoolean?.("execute_autoplay") ?? false);

        // and it is good again!
        interaction.reply({ content: "Stopped the player without leaving" });
    }
} as Command;