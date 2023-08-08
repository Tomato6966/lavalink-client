import { GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("test").setDescription("Test something inline.."),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = await client.lavalink.getPlayer(interaction.guildId);
        if(!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        
        // example to apply a filter!
        player.filterManager.toggleNightcore();
        
        interaction.reply({ content: "OK" });
    }
} as Command;