import { CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Client";
import { AudioOutputs } from "../../src";

export default { 
    data: new SlashCommandBuilder()
        .setName("audio_output")
        .setDescription("Set the audio output channel")
        .addStringOption(o => o.setName("channel").setDescription("To what output-channel do you want to set the bot?").addChoices(
            { name: "Left", value: "left" },
            { name: "Right", value: "right" },
            { name: "Mono", value: "mono" },
            { name: "Stereo", value: "stereo" },
        )),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = client.lavalink.getPlayer(interaction.guildId);
        if(!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        if(!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel "});
        if(player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" })
        
        await player.filterManager.setAudioOutput((interaction.options as CommandInteractionOptionResolver).getString("channel") as AudioOutputs);

        await interaction.reply({
            content: `Now playing from the \`${player.filterManager.filters.audioOutput} Audio-Channel\``
        })
    }

} as Command;