import { CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("loop").setDescription("Set the Repeat Mode")
        .addStringOption(o => o.setName("repeatmode").setDescription("What do you want to do?").setRequired(true).setChoices({ name: "Off", value: "off"}, { name: "Track", value: "track"}, { name: "Queue", value: "queue"})),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = client.lavalink.getPlayer(interaction.guildId);
        if(!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        if(!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel "});
        if(player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" })
        if(!player.queue.current) return interaction.reply({ ephemeral: true, content: "I'm not playing anything" });
        
        await player.setRepeatMode((interaction.options as CommandInteractionOptionResolver).getString("repeatmode") as "off" | "track" | "queue");

        await interaction.reply({
            ephemeral: true, content: `Set repeat mode to ${player.repeatMode}`
        });
    }
} as Command;