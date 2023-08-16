import { CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Client";
import { formatMS_HHMMSS } from "../Utils/Time";

export default {
    data: new SlashCommandBuilder()
        .setName("volume").setDescription("Change the Volume of the Player")
        .addIntegerOption(o => o.setName("percentage").setDescription("To what Volume do you want to change").setMaxValue(200).setMinValue(0).setRequired(true))
        .addStringOption(o => o.setName("ignoredecrementer").setDescription("Should the Decrementer be ignored?").setRequired(false).setChoices({ name: "True", value: "true"},{ name: "False", value: "false"})),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        const player = client.lavalink.getPlayer(interaction.guildId);
        if(!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
        if(!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel "});
        if(player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" })
        
        if(!player.queue.current) return interaction.reply({ ephemeral: true, content: "I'm not playing anything" });
        
        await player.setVolume(((interaction.options as CommandInteractionOptionResolver).getInteger("percentage") as number), ((interaction.options as CommandInteractionOptionResolver).getString("ignoredecrementer") as string) === "true");

        await interaction.reply({
            ephemeral: true, content: `Changed volume to: \`${player.volume}\``
        });
    }
} as Command;