import { CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Client";
import { EQList } from "../Utils/EQList";

export default { 
    data: new SlashCommandBuilder()
        .setName("equalizers")
        .setDescription("Apply a specific Equalizer")
        .addStringOption(o => o.setName("equalizer").setDescription("Which Equalizer to apply?disabled").addChoices(
            { name: "Clear Equlizers", value: "clear" },
            { name: "Bassboost (High)", value: "bass_high" },
            { name: "Bassboost (Medium)", value: "bass_medium" },
            { name: "Bassboost (Low)", value: "bass_low" },
            { name: "Better Music", value: "bettermusic" }, // available in lavalink-filters lavalink-plugin
            { name: "Rock", value: "rock" },
            { name: "Classic", value: "classic" },
        )),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = client.lavalink.getPlayer(interaction.guildId);
        if(!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        if(!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel "});
        if(player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" })
        
        let string = "";
        switch((interaction.options as CommandInteractionOptionResolver).getString("equalizer")) {
            case "clear": await player.filterManager.clearEQ(); string = "Cleared all Equalizers"; break;
            case "bass_high": await player.filterManager.setEQ(EQList.BassboostHigh); string = "Applied the 'High Bassboost' Equalizer"; break;
            case "bass_medium": await player.filterManager.setEQ(EQList.BassboostMedium); string = "Applied the 'Medium Bassboost' Equalizer"; break;
            case "bass_low": await player.filterManager.setEQ(EQList.BassboostLow); string = "Applied the 'low Bassboost' Equalizer"; break;
            case "bettermusic": await player.filterManager.setEQ(EQList.BetterMusic); string = "Applied the 'Better Music' Equalizer"; break;
            case "rock": await player.filterManager.setEQ(EQList.Rock); string = "Applied the 'Rock' Equalizer"; break;
            case "classic": await player.filterManager.setEQ(EQList.Classic); string = "Applied the 'Classic' Equalizer"; break;
        }
        await interaction.reply({
            content: `✅ ${string}`
        })
    }

} as Command;