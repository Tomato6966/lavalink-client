import { CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Client";
import { formatMS_HHMMSS } from "../Utils/Time";

export default {
    data: new SlashCommandBuilder()
        .setName("seek").setDescription("Seek the position within the current Track")
        .addIntegerOption(o => o.setName("position").setDescription("To what position (seconds) to seek to?").setRequired(true)),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = client.lavalink.getPlayer(interaction.guildId);
        if(!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        if(!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel "});
        if(player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" })
        
        if(!player.queue.current) return interaction.reply({ ephemeral: true, content: "I'm not playing anything" });
        const position = ((interaction.options as CommandInteractionOptionResolver).getInteger("position") as number) * 1000;
        if(position > player.queue.current.info.duration || position < 0) return await interaction.reply({
            content: `❌ The position can't be bigger than the song's duration: ${Math.floor(player.queue.current.info.duration / 1000)} Seconds (${formatMS_HHMMSS(player.queue.current.info.duration)}) nor smaller than 0`
        })
        
        await player.seek(position);

        await interaction.reply({
            ephemeral: true, content: `Seeked to: \`${formatMS_HHMMSS(player.position)}\``
        });
    }
} as Command;