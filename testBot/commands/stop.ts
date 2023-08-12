import { GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("stop").setDescription("Stops the player"),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = client.lavalink.getPlayer(interaction.guildId);
        if(!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        
        // example to apply a filter!
        await player.destroy(`${interaction.user.username} stopped the Player`);

        // and it is good again!
        interaction.reply({ content: "Stopped the player" });
    }
} as Command;