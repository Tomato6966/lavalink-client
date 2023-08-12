import { CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Client";

export default { 
    data: new SlashCommandBuilder()
        .setName("filters")
        .setDescription("Toggle Filters")
        .addStringOption(o => o.setName("filter").setDescription("What Filter to toggle enabled/disabled").addChoices(
            { name: "Clear Filters", value: "clear" },
            { name: "Nightcore", value: "nightcore" },
            { name: "Vaporwave", value: "vaporwave" },
            { name: "LowPass", value: "lowpass" },
            { name: "Echo", value: "echo" }, // available in lavalink-filters lavalink-plugin
            { name: "Karaoke", value: "karaoke" },
            { name: "Rotation", value: "rotation" },
            { name: "Tremolo", value: "tremolo" },
            { name: "Vibrato", value: "vibrato" },
            // { name: "Reverb", value: "" }, // reverb filter currently not available in lavalink-filters lavalink-plugin
        )),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = client.lavalink.getPlayer(interaction.guildId);
        if(!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        if(!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel "});
        if(player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" })
        
        let string = "";
        switch((interaction.options as CommandInteractionOptionResolver).getString("filter")) {
            case "clear": await player.filterManager.resetFilters(); string = "Disabled all Filter-Effects"; break;
            case "lowpass": await player.filterManager.toggleLowPass(); string = player.filterManager.filters.lowPass ? "Applied Lowpass Filter-Effect" : "Disabled Lowpass Filter-Effect"; break;
            case "nightcore": await player.filterManager.toggleNightcore(); string = player.filterManager.filters.nightcore ? "Applied Nightcore Filter-Effect, ||disabled Vaporwave (if it was active)||" : "Disabled Nightcore Filter-Effect"; break;
            case "vaporwave": await player.filterManager.toggleVaporwave(); string = player.filterManager.filters.vaporwave ? "Applied Vaporwave Filter-Effect, ||disabled Nightcore (if it was active)||" : "Disabled Vaporwave Filter-Effect"; break;
            case "echo": await player.filterManager.toggleEcho(); string = player.filterManager.filters.echo ? "Applied Echo Filter-Effect" : "Disabled Echo Filter-Effect"; break;
            case "karaoke": await player.filterManager.toggleKaraoke(); string = player.filterManager.filters.karaoke ? "Applied Karaoke Filter-Effect" : "Disabled Karaoke Filter-Effect"; break;
            case "rotation": await player.filterManager.toggleRotation(); string = player.filterManager.filters.rotation ? "Applied Rotation Filter-Effect" : "Disabled Rotation Filter-Effect"; break;
            case "tremolo": await player.filterManager.toggleTremolo(); string = player.filterManager.filters.tremolo ? "Applied Tremolo Filter-Effect" : "Disabled Tremolo Filter-Effect"; break;
            case "vibrato": await player.filterManager.toggleVibrato(); string = player.filterManager.filters.vibrato ? "Applied Vibrato Filter-Effect" : "Disabled Vibrato Filter-Effect"; break;
            // case "reverb": await player.filterManager.toggleReverb(); string = player.filterManager.filters.reverb ? "Applied Reverb Filter-Effect" : "Disabled Reverb Filter-Effect"; break;
        }
        await interaction.reply({
            content: `✅ ${string}`
        })
    }

} as Command;